CREATE TABLE "bids" (
	"id" serial PRIMARY KEY NOT NULL,
	"shipment_request_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"price" double precision NOT NULL,
	"currency" text NOT NULL,
	"transit_time" double precision NOT NULL,
	"transit_time_unit" text NOT NULL,
	"availability" text NOT NULL,
	"valid_until" timestamp,
	"notes" text,
	"status" text DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"shipment_request_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"on_time_performance" text NOT NULL,
	"cargo_condition" text NOT NULL,
	"comments" text,
	"would_reuse" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"company_name" text NOT NULL,
	"rfc" text NOT NULL,
	"vehicle_types" json NOT NULL,
	"service_areas" json NOT NULL,
	"currency" text NOT NULL,
	"certifications" json,
	"status" text DEFAULT 'Pending' NOT NULL,
	"score" double precision DEFAULT 0,
	"on_time_rate" double precision DEFAULT 0,
	"response_time" double precision DEFAULT 0,
	"completed_jobs" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipment_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"user_id" integer,
	"requestor_name" text NOT NULL,
	"company" text NOT NULL,
	"cargo_type" text NOT NULL,
	"weight" double precision NOT NULL,
	"volume" double precision,
	"packaging_type" text,
	"special_requirements" text,
	"pickup_address" text NOT NULL,
	"delivery_address" text NOT NULL,
	"pickup_date" text NOT NULL,
	"delivery_date" text NOT NULL,
	"pickup_contact" text,
	"delivery_contact" text,
	"vehicle_type" text NOT NULL,
	"vehicle_size" text,
	"additional_equipment" json,
	"status" text DEFAULT 'Pending' NOT NULL,
	"assigned_provider_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shipment_requests_request_id_unique" UNIQUE("request_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"role" text NOT NULL,
	"company_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_shipment_request_id_shipment_requests_id_fk" FOREIGN KEY ("shipment_request_id") REFERENCES "public"."shipment_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_shipment_request_id_shipment_requests_id_fk" FOREIGN KEY ("shipment_request_id") REFERENCES "public"."shipment_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "providers" ADD CONSTRAINT "providers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment_requests" ADD CONSTRAINT "shipment_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment_requests" ADD CONSTRAINT "shipment_requests_assigned_provider_id_providers_id_fk" FOREIGN KEY ("assigned_provider_id") REFERENCES "public"."providers"("id") ON DELETE no action ON UPDATE no action;