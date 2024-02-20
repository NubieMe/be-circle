import { Repository } from "typeorm";
import { Reply } from "../entities/Reply";
import { AppDataSource } from "../data-source";
import { validate } from "../utils/validator/validation";
import cloudinary from "../libs/cloudinary";
import ResponseError from "../error/responseError";
import { replyThreadSchema } from "../utils/validator/reply";
import likeService from "./likeService";

export default new (class ReplyService {
    private readonly replyRepository: Repository<Reply> = AppDataSource.getRepository(Reply);

    async getRepliesThread(threadId, userId) {
        const response = await this.replyRepository
            .createQueryBuilder("reply")
            .leftJoinAndSelect("reply.author", "author")
            .leftJoinAndSelect("reply.likes", "likes")
            .leftJoinAndSelect("reply.replies", "replies")
            .where("reply.thread = :thread", { thread: threadId })
            .getMany();
        const likes = response.map(async (val) => await likeService.getLikeReply(val.id, userId));

        const replies = [];
        let i = 0;
        const len = response.length;
        for (i; i < len; i++) {
            replies.push({
                id: response[i].id,
                content: response[i].content,
                image: response[i].image,
                likes: response[i].likes.length,
                isLiked: await likes[i],
                replies: response[i].replies.length,
                author: response[i].author,
                created_at: response[i].created_at,
            });
        }

        return await Promise.all(replies);
    }

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

    async deleteReply(id, session) {
        const chkReply = await this.replyRepository.findOne({ where: { id }, relations: { author: true } });

        if (!chkReply) throw new ResponseError(404, "Reply not found");
        if (session !== chkReply.author.id) throw new ResponseError(403, "You are not the author of this reply");

        await this.replyRepository.delete(id);
        return {
            message: "Reply deleted",
        };
    }
})();
