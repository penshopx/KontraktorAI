import { GetCurrentUserResponse } from "@workspace/api-zod";
import { appUsersTable, db } from "@workspace/db";
import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/require-auth";

const router: IRouter = Router();

router.get("/users/me", requireAuth, async (req, res): Promise<void> => {
  const userId = res.locals.userId as string;

  await db
    .insert(appUsersTable)
    .values({ clerkUserId: userId })
    .onConflictDoNothing({ target: appUsersTable.clerkUserId });

  const [appUser] = await db
    .select()
    .from(appUsersTable)
    .where(eq(appUsersTable.clerkUserId, userId))
    .limit(1);

  if (!appUser) {
    req.log.error("Authenticated user profile could not be provisioned");
    res.status(500).json({ error: "Unable to load user profile" });
    return;
  }

  const response = GetCurrentUserResponse.parse({
    userId: appUser.clerkUserId,
    role: appUser.role,
    createdAt: appUser.createdAt.toISOString(),
  });

  res.json(response);
});

export default router;
