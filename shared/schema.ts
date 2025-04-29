import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  doublePrecision,
  json,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles
export enum UserRole {
  AGENT = "agent",
  PROVIDER = "provider",
}

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().$type<UserRole>(),
  companyName: text("company_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Payment Terms
export enum PaymentTerms {
  ON_DELIVERY = "On Delivery",
  CREDIT = "Credit",
}

// Credit Terms
export enum CreditTerms {
  DAYS_7 = "7 days",
  DAYS_15 = "15 days",
  DAYS_30 = "30 days",
  DAYS_60 = "60 days",
  NA = "N/A",
}

// Provider Types
export enum ProviderType {
  NATIONAL = "National",
  PORTS = "Ports",
  TRANSFER = "Transfer",
  INTERNATIONAL = "International",
  TRANSSHIPMENT = "Transshipment",
}

// Equipment Handled - Using specific Mexican terms
export enum EquipmentHandled {
  CAJA_SECA = "Caja Seca",
  PLATAFORMA = "Plataforma",
  PORTACONTENEDOR_SENCILLO = "Portacontenedor Sencillo",
  PORTACONTENEDOR_FULL = "Portacontenedor Full",
  TORTON = "Torton",
  RABON = "Rabón",
  TRES_MEDIO = "3½",
  REFRIGERADO = "Refrigerado",
  LOW_BOY = "Low boy",
  STEP_DECK = "Step Deck",
  NISSAN = "Nissan",
  ESTAQUITA = "Estaquita",
  MADRINA = "Madrina",
  CONSOLIDADO = "Consolidado",
  OTHER = "Other",
}

// Ports Covered
export enum PortsCovered {
  MANZANILLO = "Manzanillo",
  LAZARO_CARDENAS = "Lázaro Cárdenas",
  ALTAMIRA = "Altamira",
  VERACRUZ = "Veracruz",
  ENSENADA = "Ensenada",
  PUERTO_PROGRESO = "Puerto Progreso",
  OTHER = "Other",
}

// Airports Covered
export enum AirportsCovered {
  AIFA = "AIFA",
  AICM = "AICM",
  MONTERREY = "Monterrey",
  GUADALAJARA = "Guadalajara",
  OTHER = "Other",
}

// Border Crossings
export enum BorderCrossings {
  NUEVO_LAREDO = "Nuevo Laredo",
  COLOMBIA = "Colombia",
  JUAREZ = "Juárez",
  TIJUANA = "Tijuana",
  MEXICALI = "Mexicali",
  NOGALES = "Nogales",
  REYNOSA = "Reynosa",
  MATAMOROS = "Matamoros",
  NUEVO_PROGRESO = "Nuevo Progreso",
  PIEDRAS_NEGRAS = "Piedras Negras",
  OTHER = "Other",
  NA = "N/A",
}

// Cargo Types
export enum CargoTypesHandled {
  GENERAL = "General",
  REFRIGERATED = "Refrigerated",
  HAZARDOUS = "Hazardous",
  OVERSIZED_OVERWEIGHT = "Oversized/Overweight",
  OTHER = "Other",
}

// Vehicle types (keeping for backward compatibility)
export enum VehicleType {
  DRY_VAN = "Dry Van",
  FLATBED = "Flatbed",
  REFRIGERATED = "Refrigerated",
  TANKER = "Tanker",
  CONTAINER = "Container",
  OTHER = "Other",
}

// Service areas
export enum ServiceArea {
  NORTH = "North",
  CENTRAL = "Central",
  SOUTH = "South",
  EAST = "East",
  WEST = "West",
  NATIONWIDE = "Nationwide",
}

// Certification types
export enum CertificationType {
  OEA = "OEA",
  ISO9001 = "ISO 9001",
  ISO14001 = "ISO 14001",
  CTPAT = "C-TPAT",
  OTHER = "Other",
}

// Currency types
export enum CurrencyType {
  MXN = "MXN",
  USD = "USD",
}

// Provider status
export enum ProviderStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

// Define type for banking reference
export const bankingReferenceSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});
export type BankingReference = z.infer<typeof bankingReferenceSchema>;

// Define type for contact information
export const contactInfoSchema = z.object({
  name: z.string(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});
export type ContactInfo = z.infer<typeof contactInfoSchema>;

// Providers table
export const providers = pgTable("providers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  companyName: text("company_name").notNull(),
  rfc: text("rfc").notNull(),
  
  // New fields
  paymentTerms: text("payment_terms").$type<PaymentTerms>(),
  creditTerms: text("credit_terms").$type<CreditTerms>(),
  bankingReferences: json("banking_references").$type<BankingReference[]>(),
  quotationContact: json("quotation_contact").$type<ContactInfo>(),
  providerType: text("provider_type").$type<ProviderType>(),
  equipmentHandled: json("equipment_handled").$type<EquipmentHandled[]>(),
  portsCovered: json("ports_covered").$type<PortsCovered[]>(),
  airportsCovered: json("airports_covered").$type<AirportsCovered[]>(),
  borderCrossings: json("border_crossings").$type<BorderCrossings[]>(),
  cargoTypesHandled: json("cargo_types_handled").$type<CargoTypesHandled[]>(),
  storageYardsLocation: json("storage_yards_location").$type<string[]>(),
  
  // Existing fields
  vehicleTypes: json("vehicle_types").$type<VehicleType[]>().notNull(),
  serviceAreas: json("service_areas").$type<ServiceArea[]>().notNull(),
  currency: text("currency").$type<CurrencyType>().notNull(),
  certifications: json("certifications").$type<CertificationType[]>(),
  status: text("status").$type<ProviderStatus>().notNull().default(ProviderStatus.PENDING),
  score: doublePrecision("score").default(0),
  onTimeRate: doublePrecision("on_time_rate").default(0),
  responseTime: doublePrecision("response_time").default(0),
  completedJobs: integer("completed_jobs").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProviderSchema = createInsertSchema(providers).omit({
  id: true,
  userId: true,
  score: true,
  onTimeRate: true,
  responseTime: true,
  completedJobs: true,
  createdAt: true,
});
export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type Provider = typeof providers.$inferSelect;

// Shipment request status
export enum ShipmentRequestStatus {
  PENDING = "Pending",
  ASSIGNED = "Assigned",
  IN_TRANSIT = "In Transit",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

// Cargo types
export enum CargoType {
  GENERAL = "General Merchandise",
  PERISHABLE = "Perishable Goods",
  HAZARDOUS = "Hazardous Materials",
  FRAGILE = "Fragile Items",
  AUTOMOTIVE = "Automotive Parts",
}

// Packaging types
export enum PackagingType {
  PALLETS = "Pallets",
  BOXES = "Boxes",
  CRATES = "Crates",
  DRUMS = "Drums",
  BULK = "Bulk",
}

// Additional equipment
export enum AdditionalEquipment {
  LIFTGATE = "Liftgate",
  PALLET_JACK = "Pallet Jack",
  LOAD_BARS = "Load Bars",
  BLANKETS = "Blankets",
}

// Shipment requests table
export const shipmentRequests = pgTable("shipment_requests", {
  id: serial("id").primaryKey(),
  requestId: text("request_id").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  requestorName: text("requestor_name").notNull(),
  company: text("company").notNull(),
  cargoType: text("cargo_type").$type<CargoType>().notNull(),
  weight: doublePrecision("weight").notNull(),
  volume: doublePrecision("volume"),
  packagingType: text("packaging_type").$type<PackagingType>(),
  specialRequirements: text("special_requirements"),
  pickupAddress: text("pickup_address").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  // Cambiamos a text para evitar problemas de conversión
  pickupDate: text("pickup_date").notNull(),
  deliveryDate: text("delivery_date").notNull(),
  pickupContact: text("pickup_contact"),
  deliveryContact: text("delivery_contact"),
  vehicleType: text("vehicle_type").$type<VehicleType>().notNull(),
  vehicleSize: text("vehicle_size"),
  additionalEquipment: json("additional_equipment").$type<
    AdditionalEquipment[]
  >(),
  status: text("status")
    .$type<ShipmentRequestStatus>()
    .notNull()
    .default(ShipmentRequestStatus.PENDING),
  assignedProviderId: integer("assigned_provider_id").references(
    () => providers.id,
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schema original de Drizzle para la DB
const baseShipmentRequestSchema = createInsertSchema(shipmentRequests).omit({
  id: true,
  requestId: true,
  userId: true,
  status: true,
  assignedProviderId: true,
  createdAt: true,
});

// Schema personalizado para la API con campos de fecha como strings
export const insertShipmentRequestSchema = z.object({
  requestId: z.string(),
  requestorName: z.string(),
  company: z.string(),
  cargoType: z.nativeEnum(CargoType),
  weight: z.number(),
  volume: z.number().optional(),
  packagingType: z.nativeEnum(PackagingType).optional(),
  specialRequirements: z.string().optional(),
  pickupAddress: z.string(),
  deliveryAddress: z.string(),
  // Acepta fechas como string y se mantienen como string en todo el proceso
  pickupDate: z.string().transform((str) => str), // forzamos que se mantenga como string
  deliveryDate: z.string().transform((str) => str), // forzamos que se mantenga como string
  pickupContact: z.string().optional(),
  deliveryContact: z.string().optional(),
  vehicleType: z.nativeEnum(VehicleType),
  vehicleSize: z.string().optional(),
  additionalEquipment: z.array(z.nativeEnum(AdditionalEquipment)).optional(),
});
export type InsertShipmentRequest = z.infer<typeof insertShipmentRequestSchema>;
export type ShipmentRequest = typeof shipmentRequests.$inferSelect;

// Bid status
export enum BidStatus {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
}

// Availability status
export enum AvailabilityStatus {
  CONFIRMED = "Confirmed - Available as requested",
  PARTIAL = "Partial - Available with adjustments",
  UNAVAILABLE = "Unavailable - Cannot fulfill request",
}

// Bids table
export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  shipmentRequestId: integer("shipment_request_id")
    .references(() => shipmentRequests.id)
    .notNull(),
  providerId: integer("provider_id")
    .references(() => providers.id)
    .notNull(),
  price: doublePrecision("price").notNull(),
  currency: text("currency").$type<CurrencyType>().notNull(),
  transitTime: doublePrecision("transit_time").notNull(),
  transitTimeUnit: text("transit_time_unit").notNull(),
  availability: text("availability").$type<AvailabilityStatus>().notNull(),
  validUntil: timestamp("valid_until"),
  notes: text("notes"),
  status: text("status").$type<BidStatus>().notNull().default(BidStatus.PENDING),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Creamos un schema personalizado para bids con manejo especial para la fecha
const baseBidSchema = createInsertSchema(bids).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertBidSchema = baseBidSchema.extend({
  // Permite que validUntil sea un string y lo convierte a Date
  validUntil: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val ? new Date(val) : null)),
});
export type InsertBid = z.infer<typeof insertBidSchema>;
export type Bid = typeof bids.$inferSelect;

// Feedback rating
export enum FeedbackRating {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

// On-time performance
export enum OnTimePerformance {
  EARLY = "early",
  ON_TIME = "ontime",
  SLIGHT_DELAY = "slight_delay",
  SIGNIFICANT_DELAY = "significant_delay",
  VERY_LATE = "very_late",
}

// Cargo condition
export enum CargoCondition {
  PERFECT = "perfect",
  MINOR_ISSUES = "minor_issues",
  SOME_DAMAGE = "some_damage",
  SIGNIFICANT_DAMAGE = "significant_damage",
}

// Reuse status
export enum ReuseStatus {
  YES = "yes",
  MAYBE = "maybe",
  NO = "no",
}

// Feedback table
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  shipmentRequestId: integer("shipment_request_id")
    .references(() => shipmentRequests.id)
    .notNull(),
  providerId: integer("provider_id")
    .references(() => providers.id)
    .notNull(),
  rating: integer("rating").$type<FeedbackRating>().notNull(),
  onTimePerformance: text("on_time_performance")
    .$type<OnTimePerformance>()
    .notNull(),
  cargoCondition: text("cargo_condition").$type<CargoCondition>().notNull(),
  comments: text("comments"),
  wouldReuse: text("would_reuse").$type<ReuseStatus>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
});
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;
