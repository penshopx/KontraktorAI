import { appUsersTable, db } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "express";

export const requireAdmin: RequestHandler = async (req, res, next) => {
  const userId = res.locals.userId as string | undefined;
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const [appUser] = await db
    .select({ role: appUsersTable.role })
    .from(appUsersTable)
    .where(eq(appUsersTable.clerkUserId, userId))
    .limit(1);

  if (appUser?.role !== "admin") {
    req.log.warn("Blocked access to administrator route");
    res.status(403).json({ error: "Administrator access required" });
    return;
  }

  next();
};
