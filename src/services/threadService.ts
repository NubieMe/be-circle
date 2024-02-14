import { Repository } from "typeorm";
import { Thread } from "../entities/Thread";
import { AppDataSource } from "../data-source";
import { validate } from "../utils/validator/validation";
import { createThreadSchema, updateThreadSchema } from "../utils/validator/threadValidator";
import cloudinary from "../libs/cloudinary";
import ResponseError from "../error/responseError";

export default new (class ThreadService {
    private readonly threadRepository: Repository<Thread> = AppDataSource.getRepository(Thread);

    async getThreads() {
        return this.threadRepository.find({
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
    }

    async getThread(id) {
        return this.threadRepository.findOne({
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

    async updateThread(id, data) {
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

    async deleteThread(id) {
        const chkThread = await this.threadRepository.countBy(id);
        if (chkThread === 0) throw new ResponseError(404, "Not Found");

        await this.threadRepository.delete(id);
        return {
            message: "Thread deleted",
        };
    }
})();
