import { Request, Response } from "express";
import replyService from "../services/replyService";
import ReplyWorker from "../workers/ReplyWorker";
import ReplyQueue from "../queue/ReplyQueue";

export default new (class ReplyController {
    async replyThread(req: Request, res: Response) {
        try {
            let data;
            if (!req.file) {
                data = {
                    content: req.body.content,
                    thread: req.body.thread,
                    author: res.locals.session.id,
                };
            } else {
                data = {
                    content: req.body.content,
                    image: req.file.filename,
                    thread: req.body.thread,
                    author: res.locals.session.id,
                };
            }
            const response = await replyService.replyThread(data);
            // const response = await ReplyQueue.create(data);

            res.status(201).json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }

    async deleteReply(req: Request, res: Response) {
        try {
            const response = await replyService.deleteReply(req.params.id, res.locals.session.id);

            res.status(200).json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }
})();
