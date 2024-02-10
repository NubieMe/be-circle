import { Router } from "express";
import authController from "../controllers/authController";
import * as multer from "multer";
import userController from "../controllers/userController";

const routes = Router();
const upload = multer();

//Auth API
routes.post("/register", upload.none(), authController.register);
routes.post("/login", authController.login);
routes.delete("/logout", authController.logout);

//User API
routes.get("/search/:username", userController.getUsers);

export default routes;
