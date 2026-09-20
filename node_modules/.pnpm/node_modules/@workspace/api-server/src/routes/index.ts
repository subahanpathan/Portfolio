import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import projectsRouter from "./projects";
import certificatesRouter from "./certificates";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/projects", projectsRouter);
router.use("/certificates", certificatesRouter);

export default router;
