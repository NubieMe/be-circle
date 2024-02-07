import { Router } from "express";
import authController from "../controllers/authController";

const routes = Router();
export default routes;

//Auth API
routes.post("/register", authController.register);
routes.get("/login", authController.login);
