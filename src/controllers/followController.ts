import { Request, Response } from "express";
import followService from "../services/followService";

export default new (class FollowController {
    async getFollows(req: Request, res: Response) {
        try {
            const response = await followService.getFollows(req.params.id);

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
            res.status(500).json({ message: error.message });
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
