import { Request, Response } from "express";
import replyService from "../services/replyService";

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

            res.status(201).json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }

    async repliesReply(req: Request, res: Response) {
        try {
            let data;
            if (!req.file) {
                data = {
                    content: req.body.content,
                    reply: req.body.reply,
                    author: res.locals.session.id,
                };
            } else {
                data = {
                    content: req.body.content,
                    image: req.file.filename,
                    reply: req.body.reply,
                    author: res.locals.session.id,
                };
            }
            const response = await replyService.repliesReply(data);

            res.status(201).json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }
})();
