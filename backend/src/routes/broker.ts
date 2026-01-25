import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { eq, ilike } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

// Helper function to generate CSV content
function generateCSV(headers: string[], rows: string[][]): string {
  const headerLine = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',');
  const dataLines = rows.map(row =>
    row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',')
  );
  return [headerLine, ...dataLines].join('\n');
}

export function register(app: App, fastify: FastifyInstance) {
  // POST /api/broker-subscribers - Create a new broker subscriber
  fastify.post('/api/broker-subscribers', {
    schema: {
      description: 'Create a new broker subscriber',
      tags: ['broker'],
      body: {
        type: 'object',
        required: ['name', 'email', 'accountNumber', 'brokerName'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          accountNumber: { type: 'string' },
          brokerName: { type: 'string' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            accountNumber: { type: 'string' },
            brokerName: { type: 'string' },
            createdAt: { type: 'string' },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as {
      name: string;
      email: string;
      accountNumber: string;
      brokerName: string;
    };

    app.logger.info({ body }, 'Creating new broker subscriber');

    try {
      const subscriber = await app.db.insert(schema.broker_subscribers).values({
        name: body.name,
        email: body.email,
        account_number: body.accountNumber,
        broker_name: body.brokerName,
      }).returning();

      const created = subscriber[0];

      app.logger.info({ subscriberId: created.id, brokerName: body.brokerName }, 'Broker subscriber created successfully');

      reply.status(201);
      return {
        id: created.id,
        name: created.name,
        email: created.email,
        accountNumber: created.account_number,
        brokerName: created.broker_name,
        createdAt: created.created_at?.toISOString(),
      };
    } catch (error) {
      app.logger.error({ err: error, body }, 'Failed to create broker subscriber');
      return reply.status(500).send({ error: 'Failed to create broker subscriber' });
    }
  });

  // GET /api/broker-subscribers - Get all broker subscribers
  fastify.get('/api/broker-subscribers', {
    schema: {
      description: 'Get all broker subscribers',
      tags: ['broker'],
      querystring: {
        type: 'object',
        properties: {
          broker: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              accountNumber: { type: 'string' },
              brokerName: { type: 'string' },
              createdAt: { type: 'string' },
            },
          },
        },
      },
    }
  }, async (request: FastifyRequest) => {
    const query = request.query as { broker?: string };

    app.logger.info({ broker: query.broker }, 'Fetching broker subscribers');

    try {
      let subscribers;

      if (query.broker) {
        subscribers = await app.db.query.broker_subscribers.findMany({
          where: ilike(schema.broker_subscribers.broker_name, query.broker),
        });
      } else {
        subscribers = await app.db.select().from(schema.broker_subscribers);
      }

      const result = subscribers.map(sub => ({
        id: sub.id,
        name: sub.name,
        email: sub.email,
        accountNumber: sub.account_number,
        brokerName: sub.broker_name,
        createdAt: sub.created_at?.toISOString(),
      }));

      app.logger.info({ count: result.length, broker: query.broker }, 'Broker subscribers fetched successfully');

      return result;
    } catch (error) {
      app.logger.error({ err: error, broker: query.broker }, 'Failed to fetch broker subscribers');
      throw error;
    }
  });

  // GET /api/broker-subscribers/export - Export broker subscribers as CSV
  fastify.get('/api/broker-subscribers/export', {
    schema: {
      description: 'Export broker subscribers as CSV',
      tags: ['broker'],
      querystring: {
        type: 'object',
        properties: {
          broker: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'string',
          description: 'CSV file',
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { broker?: string };

    app.logger.info({ broker: query.broker }, 'Exporting broker subscribers to CSV');

    try {
      let subscribers;

      if (query.broker) {
        subscribers = await app.db.query.broker_subscribers.findMany({
          where: ilike(schema.broker_subscribers.broker_name, query.broker),
        });
      } else {
        subscribers = await app.db.select().from(schema.broker_subscribers);
      }

      const headers = ['Name', 'Email', 'Account Number', 'Broker', 'Created At'];
      const rows = subscribers.map(sub => [
        sub.name,
        sub.email,
        sub.account_number,
        sub.broker_name,
        sub.created_at?.toISOString() || '',
      ]);

      const csv = generateCSV(headers, rows);

      reply.type('text/csv');
      reply.header('Content-Disposition', 'attachment; filename="broker-subscribers.csv"');

      app.logger.info({ count: subscribers.length, broker: query.broker }, 'Broker subscribers exported to CSV successfully');

      return csv;
    } catch (error) {
      app.logger.error({ err: error, broker: query.broker }, 'Failed to export broker subscribers to CSV');
      return reply.status(500).send({ error: 'Failed to export broker subscribers' });
    }
  });
}
