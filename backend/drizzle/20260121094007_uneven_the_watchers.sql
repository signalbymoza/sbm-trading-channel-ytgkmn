CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"telegram_username" text NOT NULL,
	"channel_type" text NOT NULL,
	"subscription_duration" text NOT NULL,
	"id_document_url" text NOT NULL,
	"terms_accepted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL
);
