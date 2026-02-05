import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { eq, desc } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

export function register(app: App, fastify: FastifyInstance) {
  // POST /api/opinions - Create a new opinion
  fastify.post('/api/opinions', {
    schema: {
      description: 'Create a new user opinion',
      tags: ['opinions'],
      body: {
        type: 'object',
        required: ['name', 'email', 'opinion'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string' },
          opinion: { type: 'string' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            opinion: { type: 'string' },
            approved: { type: 'boolean' },
            createdAt: { type: 'string' },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as {
      name: string;
      email: string;
      opinion: string;
    };

    app.logger.info({ name: body.name, email: body.email }, 'Creating new opinion');

    try {
      // Validate required fields
      if (!body.name || !body.email || !body.opinion) {
        app.logger.warn({}, 'Missing required fields: name, email, or opinion');
        return reply.status(400).send({ error: 'Name, email, and opinion are required' });
      }

      const opinion = await app.db.insert(schema.opinions).values({
        name: body.name,
        email: body.email,
        opinion: body.opinion,
        approved: false,
      }).returning();

      app.logger.info({ opinionId: opinion[0].id, name: body.name }, 'Opinion created successfully');

      reply.status(201);
      return {
        id: opinion[0].id,
        name: opinion[0].name,
        email: opinion[0].email,
        opinion: opinion[0].opinion,
        approved: opinion[0].approved,
        createdAt: opinion[0].created_at.toISOString(),
      };
    } catch (error) {
      app.logger.error({ err: error, body }, 'Failed to create opinion');
      return reply.status(500).send({ error: 'Failed to create opinion' });
    }
  });

  // GET /api/opinions/approved - Get all approved opinions
  fastify.get('/api/opinions/approved', {
    schema: {
      description: 'Get all approved opinions',
      tags: ['opinions'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              opinion: { type: 'string' },
              createdAt: { type: 'string' },
            },
          },
        },
      },
    }
  }, async () => {
    app.logger.info({}, 'Fetching approved opinions');

    try {
      const opinions = await app.db.select()
        .from(schema.opinions)
        .where(eq(schema.opinions.approved, true))
        .orderBy(desc(schema.opinions.created_at));

      const result = opinions.map(opinion => ({
        id: opinion.id,
        name: opinion.name,
        email: opinion.email,
        opinion: opinion.opinion,
        createdAt: opinion.created_at.toISOString(),
      }));

      app.logger.info({ count: result.length }, 'Approved opinions fetched successfully');
      return result;
    } catch (error) {
      app.logger.error({ err: error }, 'Failed to fetch approved opinions');
      throw error;
    }
  });

  // GET /api/opinions/pending - Get all pending (not approved) opinions
  fastify.get('/api/opinions/pending', {
    schema: {
      description: 'Get all pending (not approved) opinions',
      tags: ['opinions'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              opinion: { type: 'string' },
              createdAt: { type: 'string' },
            },
          },
        },
      },
    }
  }, async () => {
    app.logger.info({}, 'Fetching pending opinions');

    try {
      const opinions = await app.db.select()
        .from(schema.opinions)
        .where(eq(schema.opinions.approved, false))
        .orderBy(desc(schema.opinions.created_at));

      const result = opinions.map(opinion => ({
        id: opinion.id,
        name: opinion.name,
        email: opinion.email,
        opinion: opinion.opinion,
        createdAt: opinion.created_at.toISOString(),
      }));

      app.logger.info({ count: result.length }, 'Pending opinions fetched successfully');
      return result;
    } catch (error) {
      app.logger.error({ err: error }, 'Failed to fetch pending opinions');
      throw error;
    }
  });

  // PUT /api/opinions/:id/approve - Approve an opinion
  fastify.put('/api/opinions/:id/approve', {
    schema: {
      description: 'Approve an opinion',
      tags: ['opinions'],
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
            opinion: { type: 'string' },
            approved: { type: 'boolean' },
            createdAt: { type: 'string' },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    app.logger.info({ opinionId: id }, 'Approving opinion');

    try {
      // Check if opinion exists
      const existingOpinion = await app.db.query.opinions.findFirst({
        where: eq(schema.opinions.id, id as any),
      });

      if (!existingOpinion) {
        app.logger.warn({ opinionId: id }, 'Opinion not found for approval');
        return reply.status(404).send({ error: 'Opinion not found' });
      }

      // Update opinion to approved
      const updatedOpinion = await app.db.update(schema.opinions)
        .set({ approved: true })
        .where(eq(schema.opinions.id, id as any))
        .returning();

      app.logger.info({ opinionId: id, name: existingOpinion.name }, 'Opinion approved successfully');

      return {
        id: updatedOpinion[0].id,
        name: updatedOpinion[0].name,
        email: updatedOpinion[0].email,
        opinion: updatedOpinion[0].opinion,
        approved: updatedOpinion[0].approved,
        createdAt: updatedOpinion[0].created_at.toISOString(),
      };
    } catch (error) {
      app.logger.error({ err: error, opinionId: id }, 'Failed to approve opinion');
      return reply.status(500).send({ error: 'Failed to approve opinion' });
    }
  });

  // DELETE /api/opinions/:id - Delete an opinion
  fastify.delete('/api/opinions/:id', {
    schema: {
      description: 'Delete an opinion',
      tags: ['opinions'],
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
            success: { type: 'boolean' },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    app.logger.info({ opinionId: id }, 'Deleting opinion');

    try {
      // Check if opinion exists
      const existingOpinion = await app.db.query.opinions.findFirst({
        where: eq(schema.opinions.id, id as any),
      });

      if (!existingOpinion) {
        app.logger.warn({ opinionId: id }, 'Opinion not found for deletion');
        return reply.status(404).send({ error: 'Opinion not found' });
      }

      // Delete the opinion
      await app.db.delete(schema.opinions)
        .where(eq(schema.opinions.id, id as any));

      app.logger.info({ opinionId: id, name: existingOpinion.name }, 'Opinion deleted successfully');

      return {
        success: true,
      };
    } catch (error) {
      app.logger.error({ err: error, opinionId: id }, 'Failed to delete opinion');
      return reply.status(500).send({ error: 'Failed to delete opinion' });
    }
  });
}
