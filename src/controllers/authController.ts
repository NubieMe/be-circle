import { Request, Response } from "express";
import authService from "../services/authService";

export default new (class AuthController {
    async register(req: Request, res: Response) {
        try {
            const response = await authService.register(req.body);

            return res
                .status(201)
                .cookie("C.id", response.token, {
                    httpOnly: true,
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                })
                .json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const response = await authService.login(req.body);

            return res
                .status(200)
                .cookie("C.id", response.token, {
                    httpOnly: true,
                    sameSite: "none",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                })
                .json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            return res.status(200).clearCookie("C.id").json({ message: "Logout success" });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
})();
