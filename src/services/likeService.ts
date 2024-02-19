import { Repository } from "typeorm";
import { Like } from "../entities/Like";
import { AppDataSource } from "../data-source";

export default new (class LikeService {
    private readonly likeRepository: Repository<Like> = AppDataSource.getRepository(Like);

    async likeThread(threadId, sessionId) {
        const response = await this.likeRepository.save({
            thread: threadId,
            author: sessionId,
        });
        return {
            message: "Thread Liked",
        };
    }

    async likeReply(replyId, sessionId) {
        this.likeRepository.save({
            reply: replyId,
            author: sessionId,
        });
        return {
            message: "Reply's Liked",
        };
    }

    async getLikeThread(threadId, authorId) {
        const chk = await this.likeRepository
            .createQueryBuilder("like")
            .where("like.thread = :thread", { thread: threadId })
            .andWhere("like.author = :author", { author: authorId })
            .getOne();

        if (chk) return true;
        return false;
    }

    async getLikeReply(replyId, authorId) {
        const chk = await this.likeRepository
            .createQueryBuilder("like")
            .where("like.thread = :thread", { reply: replyId })
            .andWhere("like.author = :author", { author: authorId })
            .getOne();

        if (chk) return true;
        return false;
    }

    async unlikeThread(id, session) {
        const getLike = await this.likeRepository
            .createQueryBuilder("like")
            .leftJoinAndSelect("like.thread", "thread")
            .leftJoinAndSelect("like.author", "author")
            .where("like.thread = :thread", { thread: id })
            .andWhere("like.author = :author", { author: session })
            .getOne();

        await this.likeRepository.delete(getLike.id);
        return {
            message: "Unliked",
        };
    }

    async unlikeReply(id, session) {
        const getLike = await this.likeRepository
            .createQueryBuilder("like")
            .leftJoinAndSelect("like.reply", "reply")
            .leftJoinAndSelect("like.author", "author")
            .where("like.reply = :reply", { reply: id })
            .andWhere("like.author = :author", { author: session })
            .getOne();

        await this.likeRepository.delete(getLike.id);
        return {
            message: "Unliked",
        };
    }
})();
