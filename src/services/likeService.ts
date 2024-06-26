import { Equal, Repository } from "typeorm";
import { Like } from "../entities/Like";
import { AppDataSource } from "../data-source";
import ResponseError from "../error/responseError";
// import { redisClient } from "../libs/redis";

export default new (class LikeService {
    private readonly likeRepository: Repository<Like> = AppDataSource.getRepository(Like);

    async likeThread(threadId, sessionId) {
        const check = await this.likeRepository.count({
            where: {
                thread: Equal(threadId),
                author: Equal(sessionId),
            },
        });
        if (check) throw new ResponseError(400, "You cannot like this Thread twice!");
        await this.likeRepository.save({
            thread: threadId,
            author: sessionId,
        });
        // redisClient.del("threads");
        return {
            message: "Thread Liked",
        };
    }

    async likeReply(replyId, sessionId) {
        const check = await this.likeRepository.count({
            where: {
                reply: Equal(replyId),
                author: Equal(sessionId),
            },
        });
        if (check) throw new ResponseError(400, "You cannot like this Reply twice!");
        await this.likeRepository.save({
            reply: replyId,
            author: sessionId,
        });
        return {
            message: "Reply's Liked",
        };
    }

    // async getLikeThread(id) {
    //     return await this.likeRepository
    //         .createQueryBuilder("like")
    //         .where("like.thread = :thread", { thread: id })
    //         .leftJoinAndSelect("like.author", "author")
    //         .select(["like.id", "author.id"])
    //         .getMany();
    // }

    // async getLikeReply(id) {
    //     return await this.likeRepository
    //         .createQueryBuilder("like")
    //         .where("like.reply = :reply", { reply: id })
    //         .leftJoinAndSelect("like.author", "author")
    //         .select(["like.id", "author.id"])
    //         .getMany();
    // }

    async unlikeThread(id, session) {
        const getLike = await this.likeRepository
            .createQueryBuilder("like")
            .leftJoinAndSelect("like.thread", "thread")
            .leftJoinAndSelect("like.author", "author")
            .where("like.thread = :thread", { thread: id })
            .andWhere("like.author = :author", { author: session })
            .getOne();
        if (!getLike) throw new ResponseError(404, "You already unlike this Thread");

        await this.likeRepository.delete(getLike.id);
        // redisClient.del("threads");
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
        if (!getLike) throw new ResponseError(404, "You already unlike this Reply");

        await this.likeRepository.delete(getLike.id);

        return {
            message: "Unliked",
        };
    }
})();
