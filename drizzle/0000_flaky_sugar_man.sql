CREATE TABLE "newsletter_subscribers" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"short_description" text,
	"brand" text DEFAULT 'LuxeHouse' NOT NULL,
	"category" text NOT NULL,
	"subcategory" text DEFAULT '' NOT NULL,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"base_price" numeric(12, 2) NOT NULL,
	"original_price" numeric(12, 2),
	"cost_price" numeric(12, 2),
	"currency" text DEFAULT 'INR' NOT NULL,
	"images" text[] DEFAULT '{}'::text[] NOT NULL,
	"videos" text[] DEFAULT '{}'::text[] NOT NULL,
	"dimensions" jsonb NOT NULL,
	"materials" text[] DEFAULT '{}'::text[] NOT NULL,
	"colors" text[] DEFAULT '{}'::text[] NOT NULL,
	"styles" text[] DEFAULT '{}'::text[] NOT NULL,
	"features" text[] DEFAULT '{}'::text[] NOT NULL,
	"customization" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"inventory" jsonb NOT NULL,
	"shipping" jsonb,
	"rating" jsonb DEFAULT '{"average":0,"count":0}'::jsonb NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"bestseller" boolean DEFAULT false NOT NULL,
	"new_arrival" boolean DEFAULT false NOT NULL,
	"on_sale" boolean DEFAULT false NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"sales_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_email_unique" ON "newsletter_subscribers" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_unique" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "products_price_idx" ON "products" USING btree ("base_price");--> statement-breakpoint
CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "products_name_idx" ON "products" USING btree ("name");