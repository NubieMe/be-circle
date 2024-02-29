import { Request, Response } from "express";
import userService from "../services/userService";

export default new (class UserController {
    async getUsers(req: Request, res: Response) {
        try {
            const response = await userService.getUsers(req.query.name);

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getUser(req: Request, res: Response) {
        try {
            const response = await userService.getUser(req.params.username);

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async getCurrent(req: Request, res: Response) {
        try {
            const response = await userService.getCurrent(res.locals.session.id);

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const response = await userService.updateUser(parseInt(req.params.id), res.locals.session.id, req.body);
            res.status(200).json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }

    async uploadPicture(req: Request, res: Response) {
        try {
            const response = await userService.uploadPicture(
                parseInt(req.params.id),
                res.locals.session.id,
                req.files[0].filename
            );
            res.status(200).json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }

    async uploadCover(req: Request, res: Response) {
        try {
            const response = await userService.uploadCover(
                parseInt(req.params.id),
                res.locals.session.id,
                req.files[0].filename
            );
            res.status(200).json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }

    async suggestion(req: Request, res: Response) {
        try {
            const response = await userService.suggestion(Number(req.query.id));
            res.status(200).json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const response = await userService.deleteUser(
                parseInt(req.params.id),
                res.locals.session.id,
                req.body.password
            );
            res.status(200).json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }
})();
