import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import userController from "../controllers/userController";
import upload from "../middlewares/uploadFile";

const userRoutes = Router();

userRoutes.get("/search", authMiddleware.auth, userController.getUsers);
userRoutes.get("/user/:username", userController.getUser);
userRoutes.get("/user/me/current", authMiddleware.auth, userController.getCurrent);
userRoutes.patch("/user/:id", authMiddleware.auth, userController.updateUser);
userRoutes.patch("/upload/picture/:id", authMiddleware.auth, upload.single("picture"), userController.uploadPicture);
userRoutes.patch("/upload/cover/:id", authMiddleware.auth, upload.single("cover"), userController.uploadCover);
userRoutes.delete("/user/:id", authMiddleware.auth, userController.deleteUser);
userRoutes.get("/suggestion", authMiddleware.auth,userController.suggestion);

export default userRoutes;
