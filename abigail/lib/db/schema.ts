/**
 * Database schema using Drizzle ORM.
 * Customer Databank for marketing and remarketing.
 */
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export const submissions = sqliteTable("submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  timestamp: integer("timestamp", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  email: text("email").notNull(),
  name: text("name").notNull(),
  question: text("question").notNull(),
  cardIdsDrawn: text("card_ids_drawn").notNull(), // JSON array as string
  language: text("language").notNull().default("en"),
  trialCompleted: integer("trial_completed", { mode: "boolean" }).default(false),
  paidUpgrade: integer("paid_upgrade", { mode: "boolean" }).default(false),
  readingText: text("reading_text"),
  previewText: text("preview_text"),
  emailSent: integer("email_sent", { mode: "boolean" }).default(false),
  emailSentAt: integer("email_sent_at", { mode: "timestamp" }),
  
  // Stripe payment tracking
  stripeSessionId: text("stripe_session_id"),
  stripePriceId: text("stripe_price_id"),
  paidAmount: integer("paid_amount"), // Amount in cents
  paidCurrency: text("paid_currency"), // EUR, BRL, HUF, USD
  paidAt: integer("paid_at", { mode: "timestamp" }),
  
  // Fulfillment tracking
  fulfilled: integer("fulfilled", { mode: "boolean" }).default(false),
  fulfilledAt: integer("fulfilled_at", { mode: "timestamp" }),
  abigailReading: text("abigail_reading"), // Abigail's handwritten reading
  photoPath: text("photo_path"), // Path to physical spread photo
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
  timestampIdx: index("timestamp_idx").on(table.timestamp),
  paidUpgradeIdx: index("paid_upgrade_idx").on(table.paidUpgrade),
  fulfilledIdx: index("fulfilled_idx").on(table.fulfilled),
  stripeSessionIdx: index("stripe_session_idx").on(table.stripeSessionId),
}));

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;


