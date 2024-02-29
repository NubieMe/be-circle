import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import likeController from "../controllers/likeController";

const likeRoutes = Router();

likeRoutes.post("/like/thread", authMiddleware.auth, likeController.likeThread);
likeRoutes.post("/like/reply", authMiddleware.auth, likeController.likeReply);
likeRoutes.delete("/unlike/thread", authMiddleware.auth, likeController.unlikeThread);
likeRoutes.delete("/unlike/reply", authMiddleware.auth, likeController.unlikeReply);

export default likeRoutes;
