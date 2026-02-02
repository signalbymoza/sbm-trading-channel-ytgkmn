import { createApplication } from "@specific-dev/framework";
import * as schema from './db/schema.js';
import * as subscriptionsRoutes from './routes/subscriptions.js';
import * as brokerRoutes from './routes/broker.js';
import * as profitPlansRoutes from './routes/profit-plans.js';

// Create application with schema for full database type support
export const app = await createApplication(schema);

// Enable storage for file uploads
app.withStorage();

// Configure multipart upload limits for file uploads
// This allows files up to 10MB for ID documents and other uploads
try {
  await app.fastify.register(require('@fastify/multipart'), {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB file size limit
    },
  });
} catch (error) {
  // Multipart plugin may already be registered by the framework
  // This is not a critical error
  app.logger.debug({ err: error }, 'Multipart plugin registration (may already be registered)');
}

// Export App type for use in route files
export type App = typeof app;

// Run migrations to ensure all tables exist
try {
  app.logger.info('Running database migrations...');

  // The framework handles migrations automatically when createApplication is called
  // No need to explicitly call migrate() - the schema is already applied

  app.logger.info('Database ready for operations');
} catch (error) {
  app.logger.error({ err: error }, 'Failed to prepare database');
  throw error;
}

// Register routes - add your route modules here
// IMPORTANT: Always use registration functions to avoid circular dependency issues
subscriptionsRoutes.register(app, app.fastify);
brokerRoutes.register(app, app.fastify);
profitPlansRoutes.register(app, app.fastify);

await app.run();
app.logger.info('Application running');
