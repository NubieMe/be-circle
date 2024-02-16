import { Repository } from "typeorm";
import { Reply } from "../entities/Reply";
import { AppDataSource } from "../data-source";
import { validate } from "../utils/validator/validation";
import { createThreadSchema } from "../utils/validator/thread";
import cloudinary from "../libs/cloudinary";
import ResponseError from "../error/responseError";
import { repliesReplySchema, replyThreadSchema } from "../utils/validator/reply";

export default new (class ReplyService {
    private readonly replyRepository: Repository<Reply> = AppDataSource.getRepository(Reply);

    async replyThread(data) {
        const isValid = validate(replyThreadSchema, data);
        let valid;

        if (data.image && data.content) {
            cloudinary.upload();
            const upFIle = await cloudinary.destination(isValid.image);

            valid = {
                content: isValid.content,
                image: upFIle.secure_url,
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
            cloudinary.upload();
            const upFIle = await cloudinary.destination(isValid.image);

            valid = {
                image: upFIle.secure_url,
                thread: isValid.thread,
                author: isValid.author,
            };
        } else {
            throw new ResponseError(400, "Content or Image is required");
        }

        await this.replyRepository.save(valid);
        return {
            message: "Reply created",
            data: valid,
        };
    }

    async repliesReply(data) {
        const isValid = validate(repliesReplySchema, data);
        let valid;

        if (data.image && data.content) {
            cloudinary.upload();
            const upFIle = await cloudinary.destination(isValid.image);

            valid = {
                content: isValid.content,
                image: upFIle.secure_url,
                reply: isValid.reply,
                author: isValid.author,
            };
        } else if (!data.image && data.content) {
            valid = {
                content: isValid.content,
                reply: isValid.reply,
                author: isValid.author,
            };
        } else if (data.image && !data.content) {
            cloudinary.upload();
            const upFIle = await cloudinary.destination(isValid.image);

            valid = {
                image: upFIle.secure_url,
                reply: isValid.reply,
                author: isValid.author,
            };
        } else {
            throw new ResponseError(400, "Content or Image is required");
        }

        await this.replyRepository.save(valid);
        return {
            message: "Reply created",
            data: valid,
        };
    }
})();
