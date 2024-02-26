import { Request, Response } from "express";
import followService from "../services/followService";

export default new (class FollowController {
    async getFollow(req: Request, res: Response) {
        try {
            const response = await followService.getFollow(req.params.id);

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async follow(req: Request, res: Response) {
        try {
            const response = await followService.follow(req.body.following, res.locals.session.id);

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Intenal Server Error" });
        }
    }

    async unfollow(req: Request, res: Response) {
        try {
            const response = await followService.unfollow(req.query.follower, res.locals.session.id);

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
})();
