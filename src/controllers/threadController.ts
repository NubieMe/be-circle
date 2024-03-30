import { Request, Response } from "express";
import threadService from "../services/threadService";
import ThreadQueue from "../queue/ThreadQueue";

export default new (class ThreadController {
    async getThreads(req: Request, res: Response) {
        try {
            const response = await threadService.getThreads(req.query.id);

            res.status(200).json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }

    async getThread(req: Request, res: Response) {
        try {
            const response = await threadService.getThread(req.params.id, req.query.id);

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async createThread(req: Request, res: Response) {
        try {
            let data;
            if (!req.files) {
                data = {
                    content: req.body.content,
                    author: res.locals.session.id,
                };
            } else {
                data = {
                    content: req.body.content,
                    image: req.files,
                    author: res.locals.session.id,
                };
            }
            // const response = await threadService.createThread(data);
            const response = await ThreadQueue.create(data);

            return res.status(201).json(response);
        } catch (error) {
            res.status(error.status).json(error.message);
        }
    }

    async updateThread(req: Request, res: Response) {
        try {
            let data;

            if (!req.files) {
                data = {
                    content: req.body.content,
                };
            } else {
                data = {
                    content: req.body.content,
                    image: req.files,
                };
            }
            const response = await threadService.updateThread(req.params, data, res.locals.session.id);

            res.status(200).json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }

    async deleteThread(req: Request, res: Response) {
        try {
            const response = await threadService.deleteThread(req.params, res.locals.session.id);

            res.status(200).json();
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }
})();
