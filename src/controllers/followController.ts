import { Request, Response } from "express";
import followService from "../services/followService";

export default new (class FollowController {
    async getFollow(req: Request, res: Response) {
        try {
            const response = await followService.getFollow(res.locals.session.id);

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async follow(req: Request, res: Response) {
        try {
            const response = await followService.follow(req.body, res.locals.session.id);

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Intenal Server Error" });
        }
    }

    // async unfollow() {
    //     try {

    //     } catch (error) {
    //         res.status(500).json({message: 'internal server error'})
    //     }
    // }
})();
