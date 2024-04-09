import { Equal, Repository } from "typeorm";
import { Reply } from "../entities/Reply";
import { AppDataSource } from "../data-source";
import { validate } from "../utils/validator/validation";
import cloudinary from "../libs/cloudinary";
import ResponseError from "../error/responseError";
import { replyThreadSchema } from "../utils/validator/reply";
import { redisClient } from "../libs/redis";

export default new (class ReplyService {
    private readonly replyRepository: Repository<Reply> = AppDataSource.getRepository(Reply);

    async getRepliesThread(threadId) {
        return await this.replyRepository.find({
            where: { thread: Equal(threadId) },
            relations: ["author", "likes", "likes.author"],
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
    }

    async replyThread(data) {
        const isValid = validate(replyThreadSchema, data);
        let valid;

        if (data.image && data.content) {
            cloudinary.config();
            const upFile = await cloudinary.upload(isValid.image);

            valid = {
                content: isValid.content,
                image: upFile.secure_url,
                thread: isValid.thread,
                author: isValid.author,
            };
        } else if (!data.image && data.content) {
            valid = {
                content: isValid.content,
                thread: isValid.thread,
                author: isValid.author,
            };
        } else if (data.image && !data.content) {
            cloudinary.config();
            const upFile = await cloudinary.upload(isValid.image);

            valid = {
                image: upFile.secure_url,
                thread: isValid.thread,
                author: isValid.author,
            };
        } else {
            throw new ResponseError(400, "Content or Image is required");
        }

        await this.replyRepository.save(valid);
        redisClient.del("threads");
        return {
            message: "Reply created",
            data: valid,
        };
    }

    async deleteReply(id, session) {
        const chkReply = await this.replyRepository.findOne({ where: { id }, relations: { author: true } });

        if (!chkReply) throw new ResponseError(404, "Reply not found");
        if (session !== chkReply.author.id) throw new ResponseError(403, "You are not the author of this reply");

        cloudinary.delete(chkReply.image);
        await this.replyRepository.delete(id);
        redisClient.del("threads");
        return {
            message: "Reply deleted",
        };
    }
})();
