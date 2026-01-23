ALTER TABLE "subscriptions" ADD COLUMN "subscription_start_date" timestamp;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "subscription_end_date" timestamp;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "total_months" integer DEFAULT 0 NOT NULL;