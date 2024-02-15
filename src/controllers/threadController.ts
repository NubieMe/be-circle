import { Request, Response } from "express";
import threadService from "../services/threadService";

export default new (class ThreadController {
    async getThreads(req: Request, res: Response) {
        try {
            const response = await threadService.getThreads();

            res.status(200).json(response);
        } catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }

    async getThread(req: Request, res: Response) {
        try {
            const response = await threadService.getThread(req.params);

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async createThread(req: Request, res: Response) {
        try {
            let data;

            if (!req.file) {
                data = {
                    content: req.body.content,
                    author: res.locals.session.id,
                };
            } else {
                data = {
                    content: req.body.content,
                    image: req.file.filename,
                    author: res.locals.session.id,
                };
            }
            const response = await threadService.createThread(data);

            res.status(201).json(response);
        } catch (error) {
            res.status(error.status).json(error.message);
        }
    }

    async updateThread(req: Request, res: Response) {
        try {
            let data;

            if (!req.file) {
                data = {
                    content: req.body.content,
                };
            } else {
                data = {
                    content: req.body.content,
                    image: req.file.filename,
                };
            }
            const response = await threadService.updateThread(req.params, data);

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
