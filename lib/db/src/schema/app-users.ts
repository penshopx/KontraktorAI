import { check, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const appUsersTable = pgTable(
  "app_users",
  {
    clerkUserId: text("clerk_user_id").primaryKey(),
    role: text("role").notNull().default("member"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check("app_users_role_check", sql`${table.role} in ('member', 'admin')`),
  ],
);

export const appUserRoleSchema = z.enum(["member", "admin"]);
export const insertAppUserSchema = createInsertSchema(appUsersTable).omit({
  createdAt: true,
  updatedAt: true,
});

export type AppUserRole = z.infer<typeof appUserRoleSchema>;
export type InsertAppUser = z.infer<typeof insertAppUserSchema>;
export type AppUser = typeof appUsersTable.$inferSelect;
