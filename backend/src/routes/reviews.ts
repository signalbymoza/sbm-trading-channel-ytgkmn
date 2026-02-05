import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { eq, desc } from "drizzle-orm";
import * as schema from "../db/schema.js";
import type { App } from "../index.js";

export function register(app: App, fastify: FastifyInstance) {
  // GET /api/reviews - Get approved reviews only, sorted by created_at desc
  fastify.get('/api/reviews', {
    schema: {
      description: 'Get all approved reviews',
      tags: ['reviews'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              rating: { type: 'number' },
              comment: { type: 'string' },
              channelType: { type: 'string' },
              createdAt: { type: 'string' },
              approved: { type: 'boolean' },
            },
          },
        },
      },
    }
  }, async () => {
    app.logger.info({}, 'Fetching approved reviews');

    try {
      const reviews = await app.db.select()
        .from(schema.reviews)
        .where(eq(schema.reviews.approved, true))
        .orderBy(desc(schema.reviews.created_at));

      const result = reviews.map(review => ({
        id: review.id,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        channelType: review.channel_type,
        createdAt: review.created_at.toISOString(),
        approved: review.approved,
      }));

      app.logger.info({ count: result.length }, 'Approved reviews fetched successfully');
      return result;
    } catch (error) {
      app.logger.error({ err: error }, 'Failed to fetch approved reviews');
      throw error;
    }
  });

  // GET /api/reviews/pending - Get all pending (not approved) reviews
  fastify.get('/api/reviews/pending', {
    schema: {
      description: 'Get all pending (not approved) reviews',
      tags: ['reviews'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              rating: { type: 'number' },
              comment: { type: 'string' },
              channelType: { type: 'string' },
              createdAt: { type: 'string' },
            },
          },
        },
      },
    }
  }, async () => {
    app.logger.info({}, 'Fetching pending reviews');

    try {
      const reviews = await app.db.select()
        .from(schema.reviews)
        .where(eq(schema.reviews.approved, false))
        .orderBy(desc(schema.reviews.created_at));

      const result = reviews.map(review => ({
        id: review.id,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        channelType: review.channel_type,
        createdAt: review.created_at.toISOString(),
      }));

      app.logger.info({ count: result.length }, 'Pending reviews fetched successfully');
      return result;
    } catch (error) {
      app.logger.error({ err: error }, 'Failed to fetch pending reviews');
      throw error;
    }
  });

  // POST /api/reviews - Create a new review
  fastify.post('/api/reviews', {
    schema: {
      description: 'Create a new review',
      tags: ['reviews'],
      body: {
        type: 'object',
        required: ['name', 'rating', 'comment'],
        properties: {
          name: { type: 'string' },
          rating: { type: 'number', minimum: 1, maximum: 5 },
          comment: { type: 'string' },
          channelType: { type: 'string' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            rating: { type: 'number' },
            comment: { type: 'string' },
            channelType: { type: 'string' },
            createdAt: { type: 'string' },
            approved: { type: 'boolean' },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as {
      name: string;
      rating: number;
      comment: string;
      channelType?: string;
    };

    app.logger.info({ name: body.name, rating: body.rating }, 'Creating new review');

    try {
      // Validate rating is between 1 and 5
      if (!body.rating || body.rating < 1 || body.rating > 5) {
        app.logger.warn({ rating: body.rating }, 'Invalid rating provided');
        return reply.status(400).send({ error: 'Rating must be between 1 and 5' });
      }

      // Validate required fields
      if (!body.name || !body.comment) {
        app.logger.warn({}, 'Missing required fields: name or comment');
        return reply.status(400).send({ error: 'Name and comment are required' });
      }

      const review = await app.db.insert(schema.reviews).values({
        name: body.name,
        rating: body.rating,
        comment: body.comment,
        channel_type: body.channelType || null,
        approved: false,
      }).returning();

      app.logger.info({ reviewId: review[0].id, name: body.name }, 'Review created successfully');

      reply.status(201);
      return {
        id: review[0].id,
        name: review[0].name,
        rating: review[0].rating,
        comment: review[0].comment,
        channelType: review[0].channel_type,
        createdAt: review[0].created_at.toISOString(),
        approved: review[0].approved,
      };
    } catch (error) {
      app.logger.error({ err: error, body }, 'Failed to create review');
      return reply.status(500).send({ error: 'Failed to create review' });
    }
  });

  // PUT /api/reviews/:id/approve - Approve a review
  fastify.put('/api/reviews/:id/approve', {
    schema: {
      description: 'Approve a review',
      tags: ['reviews'],
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
            rating: { type: 'number' },
            comment: { type: 'string' },
            channelType: { type: 'string' },
            createdAt: { type: 'string' },
            approved: { type: 'boolean' },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    app.logger.info({ reviewId: id }, 'Approving review');

    try {
      // Check if review exists
      const existingReview = await app.db.query.reviews.findFirst({
        where: eq(schema.reviews.id, id as any),
      });

      if (!existingReview) {
        app.logger.warn({ reviewId: id }, 'Review not found for approval');
        return reply.status(404).send({ error: 'Review not found' });
      }

      // Update review to approved
      const updatedReview = await app.db.update(schema.reviews)
        .set({ approved: true })
        .where(eq(schema.reviews.id, id as any))
        .returning();

      app.logger.info({ reviewId: id, name: existingReview.name }, 'Review approved successfully');

      return {
        id: updatedReview[0].id,
        name: updatedReview[0].name,
        rating: updatedReview[0].rating,
        comment: updatedReview[0].comment,
        channelType: updatedReview[0].channel_type,
        createdAt: updatedReview[0].created_at.toISOString(),
        approved: updatedReview[0].approved,
      };
    } catch (error) {
      app.logger.error({ err: error, reviewId: id }, 'Failed to approve review');
      return reply.status(500).send({ error: 'Failed to approve review' });
    }
  });

  // DELETE /api/reviews/:id - Delete a review
  fastify.delete('/api/reviews/:id', {
    schema: {
      description: 'Delete a review',
      tags: ['reviews'],
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
            message: { type: 'string' },
          },
        },
      },
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    app.logger.info({ reviewId: id }, 'Deleting review');

    try {
      // Check if review exists
      const existingReview = await app.db.query.reviews.findFirst({
        where: eq(schema.reviews.id, id as any),
      });

      if (!existingReview) {
        app.logger.warn({ reviewId: id }, 'Review not found for deletion');
        return reply.status(404).send({ error: 'Review not found' });
      }

      // Delete the review
      await app.db.delete(schema.reviews)
        .where(eq(schema.reviews.id, id as any));

      app.logger.info({ reviewId: id, name: existingReview.name }, 'Review deleted successfully');

      return {
        success: true,
        message: 'Review deleted successfully',
      };
    } catch (error) {
      app.logger.error({ err: error, reviewId: id }, 'Failed to delete review');
      return reply.status(500).send({ error: 'Failed to delete review' });
    }
  });
}
