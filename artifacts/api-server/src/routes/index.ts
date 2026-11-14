import { Router, type IRouter } from "express";
import healthRouter from "./health";
import consultationRequestsRouter from "./consultation-requests";
import usersRouter from "./users";

const router: IRouter = Router();

router.use(healthRouter);
router.use(consultationRequestsRouter);
router.use(usersRouter);

export default router;
