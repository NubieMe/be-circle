import { Request, Response } from "express";
import likeService from "../services/likeService";

export default new (class LikeController {
    async likeThread(req: Request, res: Response) {
        try {
            const response = await likeService.likeThread(req.body.thread, res.locals.session.id);

            res.status(200).json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }

    async likeReply(req: Request, res: Response) {
        try {
            const response = await likeService.likeReply(req.body.reply, res.locals.session.id);

            res.status(200).json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }

    async unlikeThread(req: Request, res: Response) {
        try {
            const response = await likeService.unlikeThread(req.query.id, res.locals.session.id);

            res.status(200).json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }

    async unlikeReply(req: Request, res: Response) {
        try {
            const response = await likeService.unlikeReply(req.query.id, res.locals.session.id);

            res.status(200).json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }
})();
