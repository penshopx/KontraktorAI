import {
  CreateMyConsultationRequestBody,
  CreateMyConsultationRequestResponse,
  ListAdminConsultationRequestsResponse,
  ListMyConsultationRequestsResponse,
  UpdateAdminConsultationRequestParams,
  UpdateAdminConsultationRequestBody,
  UpdateAdminConsultationRequestResponse,
} from "@workspace/api-zod";
import {
  appUsersTable,
  consultationRequestsTable,
  db,
} from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { requireAdmin } from "../middlewares/require-admin";
import { requireAuth } from "../middlewares/require-auth";

const router: IRouter = Router();

async function ensureAppUser(userId: string): Promise<void> {
  await db
    .insert(appUsersTable)
    .values({ clerkUserId: userId })
    .onConflictDoNothing({ target: appUsersTable.clerkUserId });
}

function toMyRequest(request: typeof consultationRequestsTable.$inferSelect) {
  return {
    id: request.id,
    contactEmail: request.contactEmail,
    purpose: request.purpose,
    details: request.details,
    status: request.status,
    consentedAt: request.consentedAt.toISOString(),
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
  };
}

router.get(
  "/users/me/consultation-requests",
  requireAuth,
  async (req, res): Promise<void> => {
    const userId = res.locals.userId as string;
    const requests = await db
      .select()
      .from(consultationRequestsTable)
      .where(eq(consultationRequestsTable.clerkUserId, userId))
      .orderBy(desc(consultationRequestsTable.createdAt));

    res.json(
      ListMyConsultationRequestsResponse.parse(requests.map(toMyRequest)),
    );
  },
);

router.post(
  "/users/me/consultation-requests",
  requireAuth,
  async (req, res): Promise<void> => {
    const parsed = CreateMyConsultationRequestBody.safeParse(req.body);
    if (!parsed.success || !parsed.data.consent) {
      res.status(400).json({
        error: parsed.success
          ? "Consent is required to submit a consultation request"
          : parsed.error.message,
      });
      return;
    }

    const purpose = parsed.data.purpose.trim();
    const details = parsed.data.details.trim();
    if (purpose.length < 8 || details.length < 20) {
      res.status(400).json({
        error: "Purpose and details must contain meaningful information",
      });
      return;
    }

    const userId = res.locals.userId as string;
    await ensureAppUser(userId);
    const [request] = await db
      .insert(consultationRequestsTable)
      .values({
        clerkUserId: userId,
        contactEmail: parsed.data.contactEmail.trim(),
        purpose,
        details,
      })
      .returning();

    if (!request) {
      req.log.error("Consultation request insert returned no row");
      res.status(500).json({ error: "Unable to submit consultation request" });
      return;
    }

    res
      .status(201)
      .json(CreateMyConsultationRequestResponse.parse(toMyRequest(request)));
  },
);

router.get(
  "/admin/consultation-requests",
  requireAuth,
  requireAdmin,
  async (_req, res): Promise<void> => {
    const requests = await db
      .select()
      .from(consultationRequestsTable)
      .orderBy(desc(consultationRequestsTable.createdAt));

    res.json(
      ListAdminConsultationRequestsResponse.parse(
        requests.map((request) => ({
          ...toMyRequest(request),
          userId: request.clerkUserId,
        })),
      ),
    );
  },
);

router.patch(
  "/admin/consultation-requests/:requestId",
  requireAuth,
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = UpdateAdminConsultationRequestParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const parsed = UpdateAdminConsultationRequestBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [request] = await db
      .update(consultationRequestsTable)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(consultationRequestsTable.id, params.data.requestId))
      .returning();

    if (!request) {
      res.status(404).json({ error: "Consultation request not found" });
      return;
    }

    res.json(
      UpdateAdminConsultationRequestResponse.parse({
        ...toMyRequest(request),
        userId: request.clerkUserId,
      }),
    );
  },
);

export default router;
