import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { eq, or, ilike } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

// Helper function to format subscription response with camelCase
function formatSubscriptionResponse(subscription: any) {
  return {
    id: subscription.id,
    name: subscription.name,
    email: subscription.email,
    telegramUsername: subscription.telegram_username,
    channelType: subscription.channel_type,
    subscriptionDuration: subscription.subscription_duration,
    subscriptionStartDate: subscription.subscription_start_date?.toISOString(),
    subscriptionEndDate: subscription.subscription_end_date?.toISOString(),
    totalMonths: subscription.total_months,
    status: subscription.status,
    createdAt: subscription.created_at?.toISOString(),
  };
}

// Helper function to calculate days remaining
function calculateDaysRemaining(endDate: Date | null): number {
  if (!endDate) return 0;
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function register(app: App, fastify: FastifyInstance) {
  // POST /api/upload/id-document - Upload ID document
  fastify.post('/api/upload/id-document', async (request: FastifyRequest, reply: FastifyReply) => {
    app.logger.info({ method: 'POST', path: '/api/upload/id-document' }, 'Uploading ID document');

    const options = { limits: { fileSize: 10 * 1024 * 1024 } }; // 10MB limit
    const data = await request.file(options);

    if (!data) {
      app.logger.warn({}, 'No file provided in ID document upload');
      return reply.status(400).send({ error: 'No file provided' });
    }

    try {
      const buffer = await data.toBuffer();
      const key = `id-documents/${Date.now()}-${data.filename}`;

      // Upload the file to storage and get the key
      const uploadedKey = await app.storage.upload(key, buffer);

      // Generate a signed URL for access
      const { url } = await app.storage.getSignedUrl(uploadedKey);

      app.logger.info({ key: uploadedKey, filename: data.filename }, 'ID document uploaded successfully');

      return { url, filename: data.filename };
    } catch (error) {
      app.logger.error({ err: error, filename: data.filename }, 'Failed to upload ID document');
      return reply.status(500).send({ error: 'File upload failed' });
    }
  });

  // POST /api/subscriptions - Create new subscription
  fastify.post('/api/subscriptions', {
    schema: {
      description: 'Create a new subscription',
      tags: ['subscriptions'],
      body: {
        type: 'object',
        required: ['name', 'email', 'telegram_username', 'channel_type', 'subscription_duration', 'id_document_url', 'terms_accepted'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          telegram_username: { type: 'string' },
          channel_type: { type: 'string' },
          subscription_duration: { type: 'string' },
          id_document_url: { type: 'string' },
          terms_accepted: { type: 'boolean' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            telegram_username: { type: 'string' },
            channel_type: { type: 'string' },
            subscription_duration: { type: 'string' },
            id_document_url: { type: 'string' },
            terms_accepted: { type: 'boolean' },
            created_at: { type: 'string' },
            status: { type: 'string' },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as {
      name: string;
      email: string;
      telegram_username: string;
      channel_type: string;
      subscription_duration: string;
      id_document_url: string;
      terms_accepted: boolean;
    };

    app.logger.info({ body }, 'Creating new subscription');

    try {
      const subscription = await app.db.insert(schema.subscriptions).values({
        name: body.name,
        email: body.email,
        telegram_username: body.telegram_username,
        channel_type: body.channel_type,
        subscription_duration: body.subscription_duration,
        id_document_url: body.id_document_url,
        terms_accepted: body.terms_accepted,
      }).returning();

      app.logger.info({ subscriptionId: subscription[0].id }, 'Subscription created successfully');

      reply.status(201);
      return subscription[0];
    } catch (error) {
      app.logger.error({ err: error, body }, 'Failed to create subscription');
      return reply.status(500).send({ error: 'Failed to create subscription' });
    }
  });

  // POST /api/subscriptions/lookup - Look up subscription by email or telegram username
  fastify.post('/api/subscriptions/lookup', {
    schema: {
      description: 'Look up subscription by email or telegram username',
      tags: ['subscriptions'],
      body: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          telegramUsername: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            found: { type: 'boolean' },
            subscription: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                telegramUsername: { type: 'string' },
                channelType: { type: 'string' },
                subscriptionDuration: { type: 'string' },
                subscriptionStartDate: { type: 'string' },
                subscriptionEndDate: { type: 'string' },
                totalMonths: { type: 'number' },
                daysRemaining: { type: 'number' },
                status: { type: 'string' },
                createdAt: { type: 'string' },
              },
            },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as {
      email?: string;
      telegramUsername?: string;
    };

    app.logger.info({ email: body.email, telegramUsername: body.telegramUsername }, 'Looking up subscription');

    // Validate that at least one search field is provided
    if (!body.email && !body.telegramUsername) {
      app.logger.warn({}, 'Lookup request without email or telegramUsername');
      return reply.status(400).send({ error: 'Either email or telegramUsername is required' });
    }

    try {
      // Build the where condition for case-insensitive search
      const conditions = [];
      if (body.email) {
        conditions.push(ilike(schema.subscriptions.email, body.email));
      }
      if (body.telegramUsername) {
        conditions.push(ilike(schema.subscriptions.telegram_username, body.telegramUsername));
      }

      const subscription = await app.db.query.subscriptions.findFirst({
        where: conditions.length > 0 ? or(...conditions) : undefined,
      });

      if (!subscription) {
        app.logger.info({ email: body.email, telegramUsername: body.telegramUsername }, 'Subscription not found');
        return { found: false };
      }

      const formatted = formatSubscriptionResponse(subscription);
      const daysRemaining = calculateDaysRemaining(subscription.subscription_end_date);

      app.logger.info({ subscriptionId: subscription.id }, 'Subscription lookup successful');

      return {
        found: true,
        subscription: {
          ...formatted,
          daysRemaining,
        },
      };
    } catch (error) {
      app.logger.error({ err: error, email: body.email, telegramUsername: body.telegramUsername }, 'Failed to lookup subscription');
      return reply.status(500).send({ error: 'Failed to lookup subscription' });
    }
  });

  // GET /api/subscriptions - Get all subscriptions
  fastify.get('/api/subscriptions', {
    schema: {
      description: 'Get all subscriptions',
      tags: ['subscriptions'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              telegram_username: { type: 'string' },
              channel_type: { type: 'string' },
              subscription_duration: { type: 'string' },
              id_document_url: { type: 'string' },
              terms_accepted: { type: 'boolean' },
              created_at: { type: 'string' },
              status: { type: 'string' },
            },
          },
        },
      },
    }
  }, async () => {
    app.logger.info({}, 'Fetching all subscriptions');

    try {
      const subscriptions = await app.db.select().from(schema.subscriptions);
      app.logger.info({ count: subscriptions.length }, 'Subscriptions fetched successfully');
      return subscriptions;
    } catch (error) {
      app.logger.error({ err: error }, 'Failed to fetch subscriptions');
      throw error;
    }
  });

  // GET /api/subscriptions/:id - Get single subscription by id
  fastify.get('/api/subscriptions/:id', {
    schema: {
      description: 'Get a subscription by ID',
      tags: ['subscriptions'],
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
            name: { type: 'string' },
            email: { type: 'string' },
            telegram_username: { type: 'string' },
            channel_type: { type: 'string' },
            subscription_duration: { type: 'string' },
            id_document_url: { type: 'string' },
            terms_accepted: { type: 'boolean' },
            created_at: { type: 'string' },
            status: { type: 'string' },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    app.logger.info({ subscriptionId: id }, 'Fetching subscription');

    try {
      const subscription = await app.db.query.subscriptions.findFirst({
        where: eq(schema.subscriptions.id, id),
      });

      if (!subscription) {
        app.logger.warn({ subscriptionId: id }, 'Subscription not found');
        return reply.status(404).send({ error: 'Subscription not found' });
      }

      app.logger.info({ subscriptionId: id }, 'Subscription fetched successfully');
      return subscription;
    } catch (error) {
      app.logger.error({ err: error, subscriptionId: id }, 'Failed to fetch subscription');
      return reply.status(500).send({ error: 'Failed to fetch subscription' });
    }
  });

  // PUT /api/subscriptions/:id/extend - Extend an existing subscription
  fastify.put('/api/subscriptions/:id/extend', {
    schema: {
      description: 'Extend an existing subscription',
      tags: ['subscriptions'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },
      body: {
        type: 'object',
        required: ['additionalMonths'],
        properties: {
          additionalMonths: { type: 'number' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            telegramUsername: { type: 'string' },
            channelType: { type: 'string' },
            subscriptionDuration: { type: 'string' },
            subscriptionStartDate: { type: 'string' },
            subscriptionEndDate: { type: 'string' },
            totalMonths: { type: 'number' },
            daysRemaining: { type: 'number' },
            status: { type: 'string' },
            createdAt: { type: 'string' },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const body = request.body as {
      additionalMonths: number;
    };

    app.logger.info({ subscriptionId: id, additionalMonths: body.additionalMonths }, 'Extending subscription');

    // Validate additionalMonths
    if (!body.additionalMonths || ![1, 3, 12].includes(body.additionalMonths)) {
      app.logger.warn({ subscriptionId: id, additionalMonths: body.additionalMonths }, 'Invalid additionalMonths value');
      return reply.status(400).send({ error: 'additionalMonths must be 1, 3, or 12' });
    }

    try {
      // Fetch the current subscription
      const subscription = await app.db.query.subscriptions.findFirst({
        where: eq(schema.subscriptions.id, id),
      });

      if (!subscription) {
        app.logger.warn({ subscriptionId: id }, 'Subscription not found for extension');
        return reply.status(404).send({ error: 'Subscription not found' });
      }

      // Calculate new end date by adding months to the current end date
      const currentEndDate = subscription.subscription_end_date || new Date();
      const newEndDate = new Date(currentEndDate);
      newEndDate.setMonth(newEndDate.getMonth() + body.additionalMonths);

      // Update the subscription
      const updated = await app.db.update(schema.subscriptions)
        .set({
          subscription_end_date: newEndDate,
          total_months: subscription.total_months + body.additionalMonths,
        })
        .where(eq(schema.subscriptions.id, id))
        .returning();

      const updatedSubscription = updated[0];
      const formatted = formatSubscriptionResponse(updatedSubscription);
      const daysRemaining = calculateDaysRemaining(updatedSubscription.subscription_end_date);

      app.logger.info({ subscriptionId: id, newEndDate: newEndDate.toISOString(), totalMonths: updatedSubscription.total_months }, 'Subscription extended successfully');

      return {
        ...formatted,
        daysRemaining,
      };
    } catch (error) {
      app.logger.error({ err: error, subscriptionId: id, additionalMonths: body.additionalMonths }, 'Failed to extend subscription');
      return reply.status(500).send({ error: 'Failed to extend subscription' });
    }
  });
}
