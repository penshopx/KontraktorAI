import { createInsertSchema } from "drizzle-zod";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { appUsersTable } from "./app-users";

export const userConsentsTable = pgTable("user_consents", {
  clerkUserId: text("clerk_user_id")
    .primaryKey()
    .references(() => appUsersTable.clerkUserId, { onDelete: "cascade" }),
  analytics: boolean("analytics").notNull().default(false),
  marketing: boolean("marketing").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertUserConsentSchema = createInsertSchema(userConsentsTable).omit({
  updatedAt: true,
});

export type InsertUserConsent = z.infer<typeof insertUserConsentSchema>;
export type UserConsent = typeof userConsentsTable.$inferSelect;
