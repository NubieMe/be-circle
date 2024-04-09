import { Repository } from "typeorm";
import { Thread } from "../entities/Thread";
import { AppDataSource } from "../data-source";
import { validate } from "../utils/validator/validation";
import { createThreadSchema, updateThreadSchema } from "../utils/validator/thread";
import cloudinary from "../libs/cloudinary";
import ResponseError from "../error/responseError";
import likeService from "./likeService";
import replyService from "./replyService";
import { redisClient } from "../libs/redis";

export default new (class ThreadService {
    private readonly threadRepository: Repository<Thread> = AppDataSource.getRepository(Thread);

    async getThreads() {
        let data;
        data = await redisClient.get("threads");
        if (!data) {
            const response = await this.threadRepository.find({
                order: {
                    id: "DESC",
                },
                relations: ["likes", "likes.author", "author", "replies"],
                select: {
                    author: {
                        id: true,
                        name: true,
                        username: true,
                        picture: true,
                    },
                    likes: {
                        id: true,
                        author: {
                            id: true,
                        },
                    },
                    replies: {
                        id: true,
                    },
                },
            });
            const stringThreads = JSON.stringify(response);
            await redisClient.set("threads", stringThreads);
            data = stringThreads;
        }

        return JSON.parse(data);
    }

    async getThread(id) {
        const response = await this.threadRepository.findOne({
            where: { id },
            relations: ["likes", "likes.author", "author"],
            select: {
                author: {
                    id: true,
                    name: true,
                    username: true,
                    picture: true,
                },
                likes: {
                    id: true,
                    author: {
                        id: true,
                    },
                },
            },
        });

        // const like = await likeService.getLikeThread(response.id);
        const replies = await replyService.getRepliesThread(response.id);
        return {
            id: response.id,
            content: response.content,
            image: response.image,
            author: response.author,
            likes: response.likes,
            replies,
            created_at: response.created_at,
            updated_at: response.updated_at,
        };
    }

    async createThread(data) {
        const isValid = validate(createThreadSchema, data);
        let valid;

        if (data.image && data.content) {
            cloudinary.config();
            const upFile = await cloudinary.uploads(isValid.image);

            valid = {
                content: isValid.content,
                image: upFile,
                author: isValid.author,
            };
        } else if (!data.image && data.content) {
            valid = {
                content: isValid.content,
                author: isValid.author,
            };
        } else if (data.image && !data.content) {
            cloudinary.config();
            const upFile = await cloudinary.uploads(isValid.image);

            valid = {
                image: upFile,
                author: isValid.author,
            };
        } else {
            throw new ResponseError(400, "Content or Image is required");
        }

        await this.threadRepository.save(valid);
        await redisClient.del("threads");
        return {
            message: "Thread created",
            data: valid,
        };
    }

    async updateThread(id, data, session) {
        const chkThread = await this.threadRepository.findOne({
            where: id,
            relations: {
                author: true,
            },
        });
        if (chkThread.author.id !== session) throw new ResponseError(403, "You are not the author of this thread");

        const isValid = validate(updateThreadSchema, data);
        let valid;

        if (data.image && data.content) {
            cloudinary.config();
            const upFile = await cloudinary.uploads(isValid.image);

            valid = {
                content: isValid.content,
                image: upFile,
                updated_at: isValid.updated_at,
            };
        } else if (!data.image && data.content) {
            valid = {
                content: isValid.content,
                updated_at: isValid.updated_at,
            };
        } else if (data.image && !data.content) {
            cloudinary.config();
            const upFile = await cloudinary.uploads(isValid.image);

            valid = {
                image: upFile,
                updated_at: isValid.updated_at,
            };
        } else {
            throw new ResponseError(400, "Content or Image is required");
        }

        await this.threadRepository.update(id, valid);

        return {
            message: "Thread updated",
            data: valid,
        };
    }

    async deleteThread(id, session) {
        const chkThread = await this.threadRepository.findOne({ where: id, relations: { author: true } });
        if (!chkThread) throw new ResponseError(404, "Not Found");

        if (session !== chkThread.author.id) throw new ResponseError(403, "Cannot delete another user's Thread");
        await this.threadRepository.delete(id);
        if (chkThread.image) {
            cloudinary.deletes(chkThread.image);
        }
        await redisClient.del("threads");
        return {
            message: "Thread deleted",
        };
    }
})();
