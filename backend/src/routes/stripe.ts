import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";
import Stripe from "stripe";

// Lazy initialize Stripe client to avoid errors when env vars are not set
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripeInstance = new Stripe(stripeSecretKey);
  }
  return stripeInstance;
}

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export function register(app: App, fastify: FastifyInstance) {
  // POST /api/stripe/create-payment-intent - Create a payment intent
  fastify.post('/api/stripe/create-payment-intent', {
    schema: {
      description: 'Create a Stripe payment intent',
      tags: ['stripe'],
      body: {
        type: 'object',
        required: ['amount', 'currency'],
        properties: {
          amount: { type: 'number', description: 'Amount in cents' },
          currency: { type: 'string', default: 'usd' },
          subscriptionId: { type: 'string' },
          metadata: { type: 'object' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            clientSecret: { type: 'string' },
            paymentIntentId: { type: 'string' },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as {
      amount: number;
      currency: string;
      subscriptionId?: string;
      metadata?: Record<string, string>;
    };

    app.logger.info({ amount: body.amount, currency: body.currency, subscriptionId: body.subscriptionId }, 'Creating payment intent');

    try {
      // Validate subscription exists if provided
      if (body.subscriptionId) {
        const subscription = await app.db.query.subscriptions.findFirst({
          where: eq(schema.subscriptions.id, body.subscriptionId),
        });
        if (!subscription) {
          app.logger.warn({ subscriptionId: body.subscriptionId }, 'Subscription not found for payment intent');
          return reply.status(404).send({ error: 'Subscription not found' });
        }
      }

      // Create payment intent
      const paymentIntent = await getStripe().paymentIntents.create({
        amount: Math.round(body.amount),
        currency: body.currency || 'usd',
        metadata: {
          subscriptionId: body.subscriptionId || '',
          ...body.metadata,
        },
      });

      // Store payment record in database
      const payment = await app.db.insert(schema.payments).values({
        subscription_id: body.subscriptionId ? body.subscriptionId as any : null,
        stripe_payment_intent_id: paymentIntent.id,
        amount: Math.round(body.amount),
        currency: body.currency || 'usd',
        status: 'pending',
      }).returning();

      app.logger.info(
        { paymentId: payment[0].id, paymentIntentId: paymentIntent.id },
        'Payment intent created successfully'
      );

      reply.status(201);
      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      app.logger.error({ err: error, body }, 'Failed to create payment intent');
      return reply.status(500).send({ error: 'Failed to create payment intent' });
    }
  });

  // POST /api/stripe/create-checkout-session - Create a checkout session
  fastify.post('/api/stripe/create-checkout-session', {
    schema: {
      description: 'Create a Stripe checkout session',
      tags: ['stripe'],
      body: {
        type: 'object',
        required: ['amount', 'currency', 'successUrl', 'cancelUrl'],
        properties: {
          amount: { type: 'number', description: 'Amount in cents' },
          currency: { type: 'string', default: 'usd' },
          subscriptionId: { type: 'string' },
          successUrl: { type: 'string' },
          cancelUrl: { type: 'string' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            sessionId: { type: 'string' },
            url: { type: 'string' },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as {
      amount: number;
      currency: string;
      subscriptionId?: string;
      successUrl: string;
      cancelUrl: string;
    };

    app.logger.info(
      { amount: body.amount, currency: body.currency, subscriptionId: body.subscriptionId },
      'Creating checkout session'
    );

    try {
      // Validate subscription exists if provided
      if (body.subscriptionId) {
        const subscription = await app.db.query.subscriptions.findFirst({
          where: eq(schema.subscriptions.id, body.subscriptionId),
        });
        if (!subscription) {
          app.logger.warn({ subscriptionId: body.subscriptionId }, 'Subscription not found for checkout session');
          return reply.status(404).send({ error: 'Subscription not found' });
        }
      }

      // Create checkout session
      const session = await getStripe().checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: body.currency || 'usd',
              product_data: {
                name: body.subscriptionId ? `Payment for subscription ${body.subscriptionId}` : 'Payment',
              },
              unit_amount: Math.round(body.amount),
            },
            quantity: 1,
          },
        ],
        success_url: body.successUrl,
        cancel_url: body.cancelUrl,
        metadata: {
          subscriptionId: body.subscriptionId || '',
        },
      });

      // Store payment record in database
      const payment = await app.db.insert(schema.payments).values({
        subscription_id: body.subscriptionId ? body.subscriptionId as any : null,
        stripe_checkout_session_id: session.id,
        amount: Math.round(body.amount),
        currency: body.currency || 'usd',
        status: 'pending',
      }).returning();

      app.logger.info(
        { paymentId: payment[0].id, sessionId: session.id },
        'Checkout session created successfully'
      );

      reply.status(201);
      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      app.logger.error({ err: error, body }, 'Failed to create checkout session');
      return reply.status(500).send({ error: 'Failed to create checkout session' });
    }
  });

  // POST /api/stripe/webhook - Handle Stripe webhook events
  fastify.post('/api/stripe/webhook', {
    schema: {
      description: 'Stripe webhook endpoint for payment events',
      tags: ['stripe'],
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    app.logger.info({}, 'Stripe webhook received');

    try {
      const sig = request.headers['stripe-signature'] as string;

      if (!sig) {
        app.logger.warn({}, 'Webhook received without Stripe signature');
        return reply.status(400).send({ error: 'Missing Stripe signature' });
      }

      // Verify webhook signature
      let event: Stripe.Event;
      try {
        const body = request.body as Buffer | string;
        const bodyBuffer = typeof body === 'string' ? Buffer.from(body) : body;
        event = getStripe().webhooks.constructEvent(bodyBuffer, sig, STRIPE_WEBHOOK_SECRET);
      } catch (error) {
        app.logger.error({ err: error }, 'Webhook signature verification failed');
        return reply.status(400).send({ error: 'Invalid signature' });
      }

      app.logger.debug({ eventType: event.type }, 'Processing Stripe webhook event');

      // Handle payment intent succeeded
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        app.logger.info({ paymentIntentId: paymentIntent.id }, 'Payment intent succeeded');

        try {
          // Update payment status to succeeded
          const updatedPayments = await app.db.update(schema.payments)
            .set({
              status: 'succeeded',
              payment_method: paymentIntent.payment_method ? (paymentIntent.payment_method as string) : null,
              updated_at: new Date(),
            })
            .where(eq(schema.payments.stripe_payment_intent_id, paymentIntent.id))
            .returning();

          if (updatedPayments.length > 0) {
            app.logger.info(
              { paymentId: updatedPayments[0].id, paymentIntentId: paymentIntent.id },
              'Payment status updated to succeeded'
            );
          } else {
            app.logger.warn({ paymentIntentId: paymentIntent.id }, 'No payment found to update for succeeded event');
          }
        } catch (error) {
          app.logger.error({ err: error, paymentIntentId: paymentIntent.id }, 'Failed to update payment status on succeeded');
        }
      }

      // Handle payment intent failed
      if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        app.logger.info({ paymentIntentId: paymentIntent.id }, 'Payment intent failed');

        try {
          // Update payment status to failed
          const updatedPayments = await app.db.update(schema.payments)
            .set({
              status: 'failed',
              updated_at: new Date(),
            })
            .where(eq(schema.payments.stripe_payment_intent_id, paymentIntent.id))
            .returning();

          if (updatedPayments.length > 0) {
            app.logger.info(
              { paymentId: updatedPayments[0].id, paymentIntentId: paymentIntent.id },
              'Payment status updated to failed'
            );
          } else {
            app.logger.warn({ paymentIntentId: paymentIntent.id }, 'No payment found to update for failed event');
          }
        } catch (error) {
          app.logger.error({ err: error, paymentIntentId: paymentIntent.id }, 'Failed to update payment status on failed');
        }
      }

      // Handle checkout session completed
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        app.logger.info({ sessionId: session.id }, 'Checkout session completed');

        try {
          // Update payment status to succeeded
          const updatedPayments = await app.db.update(schema.payments)
            .set({
              status: 'succeeded',
              updated_at: new Date(),
            })
            .where(eq(schema.payments.stripe_checkout_session_id, session.id))
            .returning();

          if (updatedPayments.length > 0) {
            app.logger.info(
              { paymentId: updatedPayments[0].id, sessionId: session.id },
              'Payment status updated to succeeded for checkout session'
            );
          } else {
            app.logger.warn({ sessionId: session.id }, 'No payment found to update for checkout session completed');
          }
        } catch (error) {
          app.logger.error({ err: error, sessionId: session.id }, 'Failed to update payment status on checkout session completed');
        }
      }

      return { received: true };
    } catch (error) {
      app.logger.error({ err: error }, 'Unexpected error in webhook handler');
      return reply.status(500).send({ error: 'Webhook processing failed' });
    }
  });

  // GET /api/payments/:id - Get payment details
  fastify.get('/api/payments/:id', {
    schema: {
      description: 'Get payment details by ID',
      tags: ['stripe'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            subscriptionId: { type: 'string' },
            stripePaymentIntentId: { type: 'string' },
            stripeCheckoutSessionId: { type: 'string' },
            amount: { type: 'number' },
            currency: { type: 'string' },
            status: { type: 'string' },
            paymentMethod: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    app.logger.info({ paymentId: id }, 'Fetching payment details');

    try {
      const payment = await app.db.query.payments.findFirst({
        where: eq(schema.payments.id, id as any),
      });

      if (!payment) {
        app.logger.warn({ paymentId: id }, 'Payment not found');
        return reply.status(404).send({ error: 'Payment not found' });
      }

      app.logger.info({ paymentId: id }, 'Payment details fetched successfully');

      return {
        id: payment.id,
        subscriptionId: payment.subscription_id,
        stripePaymentIntentId: payment.stripe_payment_intent_id,
        stripeCheckoutSessionId: payment.stripe_checkout_session_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.payment_method,
        createdAt: payment.created_at.toISOString(),
        updatedAt: payment.updated_at.toISOString(),
      };
    } catch (error) {
      app.logger.error({ err: error, paymentId: id }, 'Failed to fetch payment details');
      return reply.status(500).send({ error: 'Failed to fetch payment details' });
    }
  });

  // GET /api/payments/subscription/:subscriptionId - Get all payments for a subscription
  fastify.get('/api/payments/subscription/:subscriptionId', {
    schema: {
      description: 'Get all payments for a subscription',
      tags: ['stripe'],
      params: {
        type: 'object',
        required: ['subscriptionId'],
        properties: {
          subscriptionId: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              subscriptionId: { type: 'string' },
              stripePaymentIntentId: { type: 'string' },
              stripeCheckoutSessionId: { type: 'string' },
              amount: { type: 'number' },
              currency: { type: 'string' },
              status: { type: 'string' },
              paymentMethod: { type: 'string' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { subscriptionId } = request.params as { subscriptionId: string };

    app.logger.info({ subscriptionId }, 'Fetching payments for subscription');

    try {
      // Verify subscription exists
      const subscription = await app.db.query.subscriptions.findFirst({
        where: eq(schema.subscriptions.id, subscriptionId as any),
      });

      if (!subscription) {
        app.logger.warn({ subscriptionId }, 'Subscription not found');
        return reply.status(404).send({ error: 'Subscription not found' });
      }

      // Get all payments for the subscription
      const payments = await app.db.select()
        .from(schema.payments)
        .where(eq(schema.payments.subscription_id, subscriptionId as any));

      const result = payments.map(payment => ({
        id: payment.id,
        subscriptionId: payment.subscription_id,
        stripePaymentIntentId: payment.stripe_payment_intent_id,
        stripeCheckoutSessionId: payment.stripe_checkout_session_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.payment_method,
        createdAt: payment.created_at.toISOString(),
        updatedAt: payment.updated_at.toISOString(),
      }));

      app.logger.info({ subscriptionId, count: result.length }, 'Payments fetched successfully');

      return result;
    } catch (error) {
      app.logger.error({ err: error, subscriptionId }, 'Failed to fetch subscription payments');
      return reply.status(500).send({ error: 'Failed to fetch subscription payments' });
    }
  });
}
