import { Router } from "express";
import authController from "../controllers/authController";
import * as multer from "multer";
import userController from "../controllers/userController";
import threadController from "../controllers/threadController";
import authMiddleware from "../middlewares/auth";
import uploadFile from "../middlewares/uploadFile";
import followController from "../controllers/followController";

const routes = Router();
const upload = multer();

//Auth API
routes.post("/register", authController.register);
routes.post("/login", authController.login);
routes.delete("/logout", authController.logout);

//User API
routes.get("/search/:username", userController.getUsers);
routes.get("/user/:username", userController.getUser);
routes.get("/user/current", authMiddleware.auth, userController.getCurrent);

//Thread API
routes.post("/thread", uploadFile.upload("image"), threadController.createThread);
routes.get("/thread", threadController.getThreads);
routes.get("/thread/:id", threadController.getThread);

//Follow API
routes.patch("/follow", authMiddleware.auth, followController.follow);
routes.get("/follow", authMiddleware.auth, followController.getFollow);

export default routes;
