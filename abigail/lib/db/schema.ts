/**
 * Database schema using Drizzle ORM.
 * Customer Databank for marketing and remarketing.
 */
import { pgTable, serial, text, integer, timestamp, boolean, index } from "drizzle-orm/pg-core";

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  question: text("question").notNull(),
  cardIdsDrawn: text("card_ids_drawn").notNull(), // JSON array as string
  language: text("language").notNull().default("en"),
  trialCompleted: boolean("trial_completed").default(false),
  paidUpgrade: boolean("paid_upgrade").default(false),
  readingText: text("reading_text"),
  previewText: text("preview_text"),
  emailSent: boolean("email_sent").default(false),
  emailSentAt: timestamp("email_sent_at"),
  
  // Stripe payment tracking
  stripeSessionId: text("stripe_session_id"),
  stripePriceId: text("stripe_price_id"),
  paidAmount: integer("paid_amount"), // Amount in cents
  paidCurrency: text("paid_currency"), // EUR, BRL, HUF, USD
  paidAt: timestamp("paid_at"),
  
  // Fulfillment tracking
  fulfilled: boolean("fulfilled").default(false),
  fulfilledAt: timestamp("fulfilled_at"),
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


