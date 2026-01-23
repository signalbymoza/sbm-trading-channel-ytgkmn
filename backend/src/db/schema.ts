import { pgTable, text, timestamp, uuid, boolean, integer } from 'drizzle-orm/pg-core';

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  telegram_username: text('telegram_username').notNull(),
  channel_type: text('channel_type').notNull(),
  subscription_duration: text('subscription_duration').notNull(),
  id_document_url: text('id_document_url').notNull(),
  terms_accepted: boolean('terms_accepted').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  status: text('status').notNull().default('pending'),
  subscription_start_date: timestamp('subscription_start_date'),
  subscription_end_date: timestamp('subscription_end_date'),
  total_months: integer('total_months').notNull().default(0),
});
