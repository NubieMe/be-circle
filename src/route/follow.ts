import { Router } from "express";
import followController from "../controllers/followController";
import authMiddleware from "../middlewares/auth";

const followRoutes = Router();

followRoutes.post("/follow", authMiddleware.auth, followController.follow);
followRoutes.get("/follow/:id", followController.getFollows);
followRoutes.delete("/unfollow", authMiddleware.auth, followController.unfollow);

export default followRoutes;
