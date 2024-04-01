import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import upload from "../middlewares/uploadFile";
import replyController from "../controllers/replyController";

const replyRoutes = Router();

replyRoutes.post("/reply/thread", authMiddleware.auth, upload.single("image"), replyController.replyThread);
replyRoutes.delete("/reply/:id", authMiddleware.auth, replyController.deleteReply);

export default replyRoutes;
