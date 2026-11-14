import {
  GetCurrentUserConsentsResponse,
  GetCurrentUserResponse,
  UpdateCurrentUserConsentsBody,
  UpdateCurrentUserConsentsResponse,
} from "@workspace/api-zod";
import { appUsersTable, db, userConsentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/require-auth";

const router: IRouter = Router();

async function ensureAppUser(userId: string): Promise<void> {
  await db
    .insert(appUsersTable)
    .values({ clerkUserId: userId })
    .onConflictDoNothing({ target: appUsersTable.clerkUserId });
}

router.get("/users/me", requireAuth, async (req, res): Promise<void> => {
  const userId = res.locals.userId as string;

  await ensureAppUser(userId);

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

router.get("/users/me/consents", requireAuth, async (_req, res): Promise<void> => {
  const userId = res.locals.userId as string;
  const [consent] = await db
    .select()
    .from(userConsentsTable)
    .where(eq(userConsentsTable.clerkUserId, userId))
    .limit(1);

  res.json(
    GetCurrentUserConsentsResponse.parse({
      analytics: consent?.analytics ?? false,
      marketing: consent?.marketing ?? false,
      updatedAt: consent?.updatedAt.toISOString() ?? null,
    }),
  );
});

router.put("/users/me/consents", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdateCurrentUserConsentsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = res.locals.userId as string;
  await ensureAppUser(userId);

  const [consent] = await db
    .insert(userConsentsTable)
    .values({
      clerkUserId: userId,
      analytics: parsed.data.analytics,
      marketing: parsed.data.marketing,
    })
    .onConflictDoUpdate({
      target: userConsentsTable.clerkUserId,
      set: {
        analytics: parsed.data.analytics,
        marketing: parsed.data.marketing,
        updatedAt: new Date(),
      },
    })
    .returning();

  res.json(
    UpdateCurrentUserConsentsResponse.parse({
      analytics: consent.analytics,
      marketing: consent.marketing,
      updatedAt: consent.updatedAt.toISOString(),
    }),
  );
});

export default router;
