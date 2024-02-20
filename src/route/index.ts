import { Router } from "express";
import authController from "../controllers/authController";
import * as multer from "multer";
import userController from "../controllers/userController";
import threadController from "../controllers/threadController";
import authMiddleware from "../middlewares/auth";
import uploadFile from "../middlewares/uploadFile";
import followController from "../controllers/followController";
import likeController from "../controllers/likeController";
import replyController from "../controllers/replyController";

const routes = Router();
const upload = multer();

//Auth API
routes.post("/register", authController.register);
routes.post("/login", authController.login);
routes.delete("/logout", authController.logout);

//User API
routes.get("/search", userController.getUsers);
routes.get("/user/:id", userController.getUser);
routes.get("/user/me/current", authMiddleware.auth, userController.getCurrent);
routes.patch("/user/:id", authMiddleware.auth, uploadFile.upload("image"), userController.updateUser);
routes.patch("/upload/picture/:id", authMiddleware.auth, uploadFile.upload("image"), userController.uploadPicture);
routes.patch("/upload/cover/:id", authMiddleware.auth, uploadFile.upload("image"), userController.uploadCover);
routes.delete("/user/:id", authMiddleware.auth, userController.deleteUser);

//Thread API
routes.post("/thread", authMiddleware.auth, uploadFile.upload("image"), threadController.createThread);
routes.get("/thread", threadController.getThreads);
routes.get("/thread/:id", threadController.getThread);
routes.patch("/thread/:id", authMiddleware.auth, uploadFile.upload("image"), threadController.updateThread);
routes.delete("/thread/:id", authMiddleware.auth, threadController.deleteThread);

//Follow API
routes.post("/follow", authMiddleware.auth, followController.follow);
routes.get("/follow/:id", followController.getFollow);
routes.delete("/unfollow", authMiddleware.auth, followController.unfollow);

//Like API
routes.post("/like/thread", authMiddleware.auth, likeController.likeThread);
routes.post("/like/reply", authMiddleware.auth, likeController.likeReply);
routes.delete("/unlike/thread", authMiddleware.auth, likeController.unlikeThread);
routes.delete("/unlike/reply", authMiddleware.auth, likeController.unlikeReply);

//Reply API
routes.post("/reply/thread", authMiddleware.auth, uploadFile.upload("image"), replyController.replyThread);
routes.delete("/reply/:id", authMiddleware.auth, replyController.deleteReply);

export default routes;
