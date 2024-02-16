import { Repository } from "typeorm";
import { Thread } from "../entities/Thread";
import { AppDataSource } from "../data-source";
import { validate } from "../utils/validator/validation";
import { createThreadSchema, updateThreadSchema } from "../utils/validator/threadValidator";
import cloudinary from "../libs/cloudinary";
import ResponseError from "../error/responseError";
import { Like } from "../entities/Like";
import likeService from "./likeService";

export default new (class ThreadService {
    private readonly threadRepository: Repository<Thread> = AppDataSource.getRepository(Thread);

    async getThreads() {
        const response = await this.threadRepository.find({
            relations: {
                author: true,
                likes: true,
                replies: true,
            },
            select: {
                author: {
                    name: true,
                    username: true,
                    picture: true,
                },
                likes: {
                    id: true,
                },
                replies: {
                    id: true,
                },
            },
        });

        const likes = [];
        let i = 0;
        const reslen = response.length;
        const like = response.map(async (val) => await likeService.getLikeThread(val.id));
        console.log(await Promise.all(like));

        for (i; i < reslen; i++) {
            likes.push(
                await Promise.all(
                    response[i].likes.map(
                        async (like) =>
                            await AppDataSource.getRepository(Like).findOne({
                                where: { id: like.id },
                                relations: {
                                    author: true,
                                },
                                select: {
                                    author: {
                                        id: true,
                                    },
                                },
                            })
                    )
                )
            );
        }

        return {
            threads: response,
            likes: likes,
        };
    }

    async getThread(id) {
        const response = await this.threadRepository.findOne({
            where: id,
            relations: {
                author: true,
                likes: true,
                replies: true,
            },
            select: {
                author: {
                    name: true,
                    username: true,
                    picture: true,
                },
                likes: {
                    id: true,
                },
                replies: {
                    id: true,
                    content: true,
                    image: true,
                    likes: {
                        id: true,
                    },
                    replies: {
                        id: true,
                    },
                    author: {
                        name: true,
                        username: true,
                        picture: true,
                    },
                    created_at: true,
                },
            },
        });

        const likes = response.likes.map(
            async (like) =>
                await AppDataSource.getRepository(Like).findOne({
                    where: { id: like.id },
                    relations: {
                        author: true,
                    },
                    select: {
                        author: {
                            id: true,
                        },
                    },
                })
        );

        return {
            id: response.id,
            content: response.content,
            image: response.image,
            author: response.author,
            likes: await Promise.all(likes),
            replies: response.replies,
        };
    }

    async createThread(data) {
        const isValid = validate(createThreadSchema, data);
        let valid;

        if (data.image && data.content) {
            cloudinary.upload();
            const upFIle = await cloudinary.destination(isValid.image);

            valid = {
                content: isValid.content,
                image: upFIle.secure_url,
                author: isValid.author,
            };
        } else if (!data.image && data.content) {
            valid = {
                content: isValid.content,
                author: isValid.author,
            };
        } else if (data.image && !data.content) {
            cloudinary.upload();
            const upFIle = await cloudinary.destination(isValid.image);

            valid = {
                image: upFIle.secure_url,
                author: isValid.author,
            };
        } else {
            throw new ResponseError(400, "Content or Image is required");
        }

        await this.threadRepository.save(valid);
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
            cloudinary.upload();
            const upFIle = await cloudinary.destination(isValid.image);

            valid = {
                content: isValid.content,
                image: upFIle.secure_url,
                updated_at: isValid.updated_at,
            };
        } else if (!data.image && data.content) {
            valid = {
                content: isValid.content,
                updated_at: isValid.updated_at,
            };
        } else if (data.image && !data.content) {
            cloudinary.upload();
            const upFIle = await cloudinary.destination(isValid.image);

            valid = {
                image: upFIle.secure_url,
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
        return {
            message: "Thread deleted",
        };
    }
})();
