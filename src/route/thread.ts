import { Router } from "express";
import upload from "../middlewares/uploadFile";
import authMiddleware from "../middlewares/auth";
import threadController from "../controllers/threadController";

const threadRoutes = Router();

threadRoutes.post("/thread", authMiddleware.auth, upload.any(), threadController.createThread);
threadRoutes.get("/thread", threadController.getThreads);
threadRoutes.get("/thread/:id", authMiddleware.auth, threadController.getThread);
threadRoutes.patch("/thread/:id", authMiddleware.auth, upload.any(), threadController.updateThread);
threadRoutes.delete("/thread/:id", authMiddleware.auth, threadController.deleteThread);

export default threadRoutes;
