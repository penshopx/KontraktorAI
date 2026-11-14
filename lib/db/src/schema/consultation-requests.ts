import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { check, index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { appUsersTable } from "./app-users";

export const consultationRequestStatusSchema = z.enum([
  "received",
  "reviewing",
  "follow_up",
  "closed",
]);

export const consultationRequestsTable = pgTable(
  "consultation_requests",
  {
    id: serial("id").primaryKey(),
    clerkUserId: text("clerk_user_id")
      .notNull()
      .references(() => appUsersTable.clerkUserId, { onDelete: "cascade" }),
    contactEmail: text("contact_email").notNull(),
    purpose: text("purpose").notNull(),
    details: text("details").notNull(),
    status: text("status").notNull().default("received"),
    consentedAt: timestamp("consented_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check(
      "consultation_requests_status_check",
      sql`${table.status} in ('received', 'reviewing', 'follow_up', 'closed')`,
    ),
    index("consultation_requests_owner_created_idx").on(table.clerkUserId, table.createdAt),
    index("consultation_requests_status_created_idx").on(table.status, table.createdAt),
  ],
);

export const insertConsultationRequestSchema = createInsertSchema(
  consultationRequestsTable,
).omit({
  id: true,
  status: true,
  consentedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertConsultationRequest = z.infer<typeof insertConsultationRequestSchema>;
export type ConsultationRequest = typeof consultationRequestsTable.$inferSelect;
