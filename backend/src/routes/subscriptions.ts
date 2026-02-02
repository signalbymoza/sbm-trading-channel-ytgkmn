import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { eq, or, ilike, desc } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";
import { sendConfirmationEmail, sendChannelSubscriptionEmail, sendAdminNotificationEmail, ChannelSubscriptionEmailData } from "../utils/email.js";

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

// Helper function to get subscription status based on end date
function getSubscriptionStatus(endDate: Date | null): string {
  if (!endDate) return 'pending';
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  if (endDateOnly.getTime() < today.getTime()) {
    return 'expired';
  } else if (endDateOnly.getTime() === today.getTime()) {
    return 'expiring_today';
  } else {
    return 'active';
  }
}

// Helper function to generate CSV content
function generateCSV(headers: string[], rows: string[][]): string {
  const headerLine = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',');
  const dataLines = rows.map(row =>
    row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',')
  );
  return [headerLine, ...dataLines].join('\n');
}

// Helper function to convert subscription duration string to months
function durationToMonths(duration: string): number {
  const durationLower = duration?.toLowerCase() || '';
  const months: { [key: string]: number } = {
    '1_month': 1,
    '1month': 1,
    '3_months': 3,
    '3months': 3,
    '12_months': 12,
    '12months': 12,
    'monthly': 1,
    '3_monthly': 3,
    'annual': 12,
  };
  return months[durationLower] || 0;
}

// Helper function to calculate subscription end date
function calculateEndDate(startDate: Date, months: number): Date {
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + months);
  return endDate;
}

export function register(app: App, fastify: FastifyInstance) {
  // POST /api/upload/id-document - Upload ID document
  fastify.post('/api/upload/id-document', async (request: FastifyRequest, reply: FastifyReply) => {
    app.logger.info({
      method: 'POST',
      path: '/api/upload/id-document',
      contentType: request.headers['content-type']
    }, 'ID document upload request received');

    try {
      const parts = request.parts();
      let fileData: { filename: string; buffer: Buffer; mimetype?: string } | null = null;

      // Iterate through the multipart form data to find the 'document' field
      for await (const part of parts) {
        app.logger.debug({
          partType: part.type,
          fieldname: (part as any).fieldname,
          filename: (part as any).filename
        }, 'Processing form part');

        if (part.type === 'file' && ((part as any).fieldname === 'document' || (part as any).fieldname === 'file')) {
          const buffer = await part.toBuffer();
          fileData = {
            filename: (part as any).filename,
            buffer,
            mimetype: (part as any).mimetype,
          };
          app.logger.debug({
            filename: fileData.filename,
            size: buffer.length,
            mimetype: fileData.mimetype
          }, 'File extracted from multipart form');
        }
      }

      if (!fileData) {
        app.logger.warn({}, 'No document file found in upload request (expected field: "document")');
        return reply.status(400).send({ error: 'No file provided. Please upload a file with field name "document"' });
      }

      const key = `id-documents/${Date.now()}-${fileData.filename}`;

      app.logger.debug({
        key,
        filename: fileData.filename,
        size: fileData.buffer.length
      }, 'Uploading file to storage');

      // Upload the file to storage and get the key
      const uploadedKey = await app.storage.upload(key, fileData.buffer);

      // Generate a signed URL for access
      const { url } = await app.storage.getSignedUrl(uploadedKey);

      app.logger.info({
        key: uploadedKey,
        filename: fileData.filename,
        size: fileData.buffer.length
      }, 'ID document uploaded successfully');

      return { url, filename: fileData.filename };
    } catch (error) {
      app.logger.error({ err: error }, 'Failed to upload ID document');
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
        required: ['name', 'email', 'telegram_username', 'id_document_url', 'terms_accepted', 'program'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          telegram_username: { type: 'string' },
          channel_type: { type: 'string' },
          subscription_duration: { type: 'string' },
          id_document_url: { type: 'string' },
          terms_accepted: { type: 'boolean' },
          program: { type: 'string' },
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
      channel_type?: string;
      subscription_duration?: string;
      id_document_url: string;
      terms_accepted: boolean;
      program: string;
      plan_amount?: string;
    };

    app.logger.info({ body }, 'Creating new subscription');

    try {
      // For channel subscriptions, calculate start and end dates
      const now = new Date();
      const totalMonths = durationToMonths(body.subscription_duration);
      const subscriptionStartDate = body.program === 'profit_plan' ? null : now;
      const subscriptionEndDate = totalMonths > 0 ? calculateEndDate(now, totalMonths) : null;

      const subscription = await app.db.insert(schema.subscriptions).values({
        name: body.name,
        email: body.email,
        telegram_username: body.telegram_username,
        channel_type: body.channel_type || null,
        subscription_duration: body.subscription_duration || null,
        id_document_url: body.id_document_url,
        terms_accepted: body.terms_accepted,
        plan_amount: body.plan_amount || null,
        subscription_start_date: subscriptionStartDate,
        subscription_end_date: subscriptionEndDate,
        total_months: totalMonths,
      }).returning();

      app.logger.info({ subscriptionId: subscription[0].id, program: body.program, totalMonths }, 'Subscription created successfully');

      // Send appropriate emails asynchronously
      // For profit plans, send the existing confirmation email
      if (body.program === 'profit_plan') {
        const telegramInviteLink = body.channel_type?.toLowerCase() === 'gold'
          ? (process.env.TELEGRAM_GOLD_CHANNEL_INVITE || 'https://t.me/SBMTradingChannel')
          : undefined;

        sendConfirmationEmail({
          email: body.email,
          name: body.name,
          channelType: body.channel_type,
          subscriptionDuration: body.subscription_duration,
          program: body.program,
          planAmount: body.plan_amount,
          telegramInviteLink,
        }, app.logger).catch(err => {
          app.logger.error({ err }, 'Error during profit plan confirmation email send');
        });
      } else if (body.program === 'channel_subscription' && body.channel_type && subscriptionEndDate) {
        // For channel subscriptions, send both subscriber and admin emails
        const emailData: ChannelSubscriptionEmailData = {
          subscriberName: body.name,
          subscriberEmail: body.email,
          telegramUsername: body.telegram_username,
          channelType: body.channel_type,
          subscriptionDuration: body.subscription_duration || '',
          subscriptionStartDate: subscriptionStartDate!,
          subscriptionEndDate: subscriptionEndDate,
          totalMonths,
        };

        // Send subscriber confirmation email
        sendChannelSubscriptionEmail(emailData, app.logger).catch(err => {
          app.logger.error({ err }, 'Error during channel subscription confirmation email send');
        });

        // Send admin notification email
        sendAdminNotificationEmail(emailData, app.logger).catch(err => {
          app.logger.error({ err }, 'Error during admin notification email send');
        });
      }

      reply.status(201);
      return subscription[0];
    } catch (error) {
      app.logger.error({ err: error, body }, 'Failed to create subscription');
      return reply.status(500).send({ error: 'Failed to create subscription' });
    }
  });

  // POST /api/subscriptions/send-confirmation-email - Send confirmation email
  fastify.post('/api/subscriptions/send-confirmation-email', {
    schema: {
      description: 'Send a confirmation email for a registration',
      tags: ['subscriptions'],
      body: {
        type: 'object',
        required: ['email', 'name', 'program'],
        properties: {
          email: { type: 'string' },
          name: { type: 'string' },
          channelType: { type: 'string' },
          subscriptionDuration: { type: 'string' },
          program: { type: 'string' },
          planAmount: { type: 'string' },
          telegramInviteLink: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as {
      email: string;
      name: string;
      channelType?: string;
      subscriptionDuration?: string;
      program: string;
      planAmount?: string;
      telegramInviteLink?: string;
    };

    app.logger.info({ email: body.email }, 'Sending confirmation email');

    try {
      // Use provided telegram invite link or determine it based on channel type
      const telegramInviteLink = body.telegramInviteLink
        || (body.channelType?.toLowerCase() === 'gold'
          ? (process.env.TELEGRAM_GOLD_CHANNEL_INVITE || 'https://t.me/SBMTradingChannel')
          : undefined);

      const emailSent = await sendConfirmationEmail(
        {
          email: body.email,
          name: body.name,
          channelType: body.channelType,
          subscriptionDuration: body.subscriptionDuration,
          program: body.program,
          planAmount: body.planAmount,
          telegramInviteLink,
        },
        app.logger
      );

      if (!emailSent) {
        app.logger.warn({ email: body.email }, 'Email sending returned false');
        return reply.status(500).send({ success: false, message: 'Failed to send email' });
      }

      app.logger.info({ email: body.email }, 'Confirmation email sent successfully');
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      app.logger.error({ err: error, email: body.email }, 'Failed to send confirmation email');
      return reply.status(500).send({ success: false, message: 'Failed to send email' });
    }
  });

  // POST /api/subscriptions/lookup - Look up subscription by email or telegram username
  fastify.post('/api/subscriptions/lookup', {
    schema: {
      description: 'Look up subscription by email or telegram username (auto-detects query type)',
      tags: ['subscriptions'],
      body: {
        type: 'object',
        required: ['query'],
        properties: {
          query: { type: 'string' },
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
                profitPlan: {
                  type: 'object',
                  properties: {
                    hasPlan: { type: 'boolean' },
                    planAmount: { type: 'string' },
                    fileUrl: { type: 'string' },
                    fileName: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as {
      query: string;
    };

    const query = body.query?.trim();

    app.logger.info({ query }, 'Looking up subscription');

    // Validate that query is provided
    if (!query) {
      app.logger.warn({}, 'Lookup request with empty query');
      return reply.status(400).send({ error: 'Query field is required' });
    }

    try {
      // Auto-detect if query is email (contains @) or telegram username
      const isEmail = query.includes('@');
      let subscription;

      if (isEmail) {
        // Search by email (case-insensitive), ordered by created_at DESC to get the most recent
        const results = await app.db.select()
          .from(schema.subscriptions)
          .where(ilike(schema.subscriptions.email, query))
          .orderBy(desc(schema.subscriptions.created_at))
          .limit(1);
        subscription = results.length > 0 ? results[0] : undefined;
        app.logger.debug({ query, searchType: 'email', found: !!subscription }, 'Searching by email (most recent)');
      } else {
        // Search by telegram username (case-insensitive), ordered by created_at DESC to get the most recent
        const results = await app.db.select()
          .from(schema.subscriptions)
          .where(ilike(schema.subscriptions.telegram_username, query))
          .orderBy(desc(schema.subscriptions.created_at))
          .limit(1);
        subscription = results.length > 0 ? results[0] : undefined;
        app.logger.debug({ query, searchType: 'telegramUsername', found: !!subscription }, 'Searching by telegram username (most recent)');
      }

      if (!subscription) {
        app.logger.info({ query, searchType: isEmail ? 'email' : 'telegramUsername' }, 'Subscription not found');
        return { found: false };
      }

      const formatted = formatSubscriptionResponse(subscription);
      const daysRemaining = calculateDaysRemaining(subscription.subscription_end_date);

      // Query profit plan information if subscription has a plan_amount
      let profitPlan = {
        hasPlan: false,
        planAmount: null as string | null,
        fileUrl: null as string | null,
        fileName: null as string | null,
      };

      if (subscription.plan_amount) {
        profitPlan.hasPlan = true;
        profitPlan.planAmount = subscription.plan_amount;

        // Look up the profit plan file
        try {
          const planFile = await app.db.query.profit_plan_files.findFirst({
            where: eq(schema.profit_plan_files.plan_amount, subscription.plan_amount),
          });

          if (planFile) {
            profitPlan.fileUrl = planFile.file_url;
            profitPlan.fileName = planFile.file_name;
            app.logger.debug({ planAmount: subscription.plan_amount, fileId: planFile.id }, 'Profit plan file found');
          } else {
            app.logger.debug({ planAmount: subscription.plan_amount }, 'Profit plan file not found for plan amount');
          }
        } catch (planError) {
          app.logger.warn({ err: planError, planAmount: subscription.plan_amount }, 'Error querying profit plan file');
        }
      }

      app.logger.info({ subscriptionId: subscription.id, searchType: isEmail ? 'email' : 'telegramUsername', hasPlan: profitPlan.hasPlan }, 'Subscription lookup successful');

      return {
        found: true,
        subscription: {
          ...formatted,
          daysRemaining,
          profitPlan,
        },
      };
    } catch (error) {
      app.logger.error({ err: error, query }, 'Failed to lookup subscription');
      return reply.status(500).send({ error: 'Failed to lookup subscription' });
    }
  });

  // GET /api/subscriptions/stats - Get subscription statistics
  fastify.get('/api/subscriptions/stats', {
    schema: {
      description: 'Get subscription statistics',
      tags: ['subscriptions'],
      response: {
        200: {
          type: 'object',
          properties: {
            activeCount: { type: 'number' },
            expiredCount: { type: 'number' },
            expiringTodayCount: { type: 'number' },
            totalCount: { type: 'number' },
          },
        },
      },
    }
  }, async () => {
    app.logger.info({}, 'Fetching subscription statistics');

    try {
      const subscriptions = await app.db.select().from(schema.subscriptions);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      let activeCount = 0;
      let expiredCount = 0;
      let expiringTodayCount = 0;

      subscriptions.forEach(sub => {
        if (!sub.subscription_end_date) return;
        const endDateOnly = new Date(sub.subscription_end_date.getFullYear(), sub.subscription_end_date.getMonth(), sub.subscription_end_date.getDate());

        if (endDateOnly.getTime() < today.getTime()) {
          expiredCount++;
        } else if (endDateOnly.getTime() === today.getTime()) {
          expiringTodayCount++;
        } else {
          activeCount++;
        }
      });

      app.logger.info({ activeCount, expiredCount, expiringTodayCount, totalCount: subscriptions.length }, 'Subscription statistics fetched successfully');

      return {
        activeCount,
        expiredCount,
        expiringTodayCount,
        totalCount: subscriptions.length,
      };
    } catch (error) {
      app.logger.error({ err: error }, 'Failed to fetch subscription statistics');
      throw error;
    }
  });

  // GET /api/subscriptions/list - Get list of all subscribers with details
  fastify.get('/api/subscriptions/list', {
    schema: {
      description: 'Get list of all subscribers with details',
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
              telegramUsername: { type: 'string' },
              channelType: { type: 'string' },
              subscriptionEndDate: { type: 'string' },
              status: { type: 'string' },
              daysRemaining: { type: 'number' },
            },
          },
        },
      },
    }
  }, async () => {
    app.logger.info({}, 'Fetching subscribers list');

    try {
      const subscriptions = await app.db.select().from(schema.subscriptions);
      const result = subscriptions.map(sub => ({
        id: sub.id,
        name: sub.name,
        email: sub.email,
        telegramUsername: sub.telegram_username,
        channelType: sub.channel_type,
        subscriptionEndDate: sub.subscription_end_date?.toISOString(),
        status: getSubscriptionStatus(sub.subscription_end_date),
        daysRemaining: calculateDaysRemaining(sub.subscription_end_date),
      }));

      app.logger.info({ count: result.length }, 'Subscribers list fetched successfully');
      return result;
    } catch (error) {
      app.logger.error({ err: error }, 'Failed to fetch subscribers list');
      throw error;
    }
  });

  // GET /api/subscriptions/export - Export all subscriptions as CSV
  fastify.get('/api/subscriptions/export', {
    schema: {
      description: 'Export all subscriptions as CSV',
      tags: ['subscriptions'],
      response: {
        200: {
          type: 'string',
          description: 'CSV file',
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    app.logger.info({}, 'Exporting subscriptions to CSV');

    try {
      const subscriptions = await app.db.select().from(schema.subscriptions);

      const headers = ['Name', 'Email', 'Telegram Username', 'Channel Type', 'End Date', 'Status', 'Days Remaining'];
      const rows = subscriptions.map(sub => [
        sub.name,
        sub.email,
        sub.telegram_username,
        sub.channel_type,
        sub.subscription_end_date?.toISOString() || '',
        getSubscriptionStatus(sub.subscription_end_date),
        calculateDaysRemaining(sub.subscription_end_date).toString(),
      ]);

      const csv = generateCSV(headers, rows);

      reply.type('text/csv');
      reply.header('Content-Disposition', 'attachment; filename="subscriptions.csv"');

      app.logger.info({ count: subscriptions.length }, 'Subscriptions exported to CSV successfully');

      return csv;
    } catch (error) {
      app.logger.error({ err: error }, 'Failed to export subscriptions to CSV');
      return reply.status(500).send({ error: 'Failed to export subscriptions' });
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

  // GET /api/subscriptions/:id/document-url - Generate fresh signed URL for ID document
  fastify.get('/api/subscriptions/:id/document-url', {
    schema: {
      description: 'Generate fresh signed URL for ID document (valid for 15 minutes)',
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
            url: { type: 'string' },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    app.logger.info({ subscriptionId: id }, 'Generating fresh signed URL for ID document');

    try {
      // Fetch the subscription to get the id_document_url
      const subscription = await app.db.query.subscriptions.findFirst({
        where: eq(schema.subscriptions.id, id),
      });

      if (!subscription) {
        app.logger.warn({ subscriptionId: id }, 'Subscription not found');
        return reply.status(404).send({ error: 'Subscription not found' });
      }

      if (!subscription.id_document_url) {
        app.logger.warn({ subscriptionId: id }, 'No ID document URL found for subscription');
        return reply.status(404).send({ error: 'No ID document found for this subscription' });
      }

      // The id_document_url should be stored as the S3 key/path
      // If it's a full signed URL, extract the key portion
      let documentKey = subscription.id_document_url;

      // Check if it looks like a full signed URL (contains http or query parameters)
      if (documentKey.includes('http') || documentKey.includes('?')) {
        app.logger.debug({ subscriptionId: id, url: documentKey }, 'Document URL appears to be a full signed URL, attempting to extract key');

        // Try to extract the key from the path
        try {
          const url = new URL(documentKey);
          documentKey = decodeURIComponent(url.pathname).replace(/^\//, '');
          app.logger.debug({ subscriptionId: id, extractedKey: documentKey }, 'Extracted key from signed URL');
        } catch (parseError) {
          app.logger.warn({ subscriptionId: id, err: parseError }, 'Failed to parse document URL, using as-is');
        }
      }

      // Generate a fresh signed URL (valid for 15 minutes)
      const { url } = await app.storage.getSignedUrl(documentKey);

      app.logger.info({ subscriptionId: id, documentKey }, 'Fresh signed URL generated successfully');

      return { url };
    } catch (error) {
      app.logger.error({ err: error, subscriptionId: id }, 'Failed to generate signed URL for ID document');
      return reply.status(500).send({ error: 'Failed to generate document URL' });
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
