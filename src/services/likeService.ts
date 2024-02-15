import { Repository } from "typeorm";
import { Like } from "../entities/Like";
import { AppDataSource } from "../data-source";

export default new (class LikeService {
    private readonly likeRepository: Repository<Like> = AppDataSource.getRepository(Like);

    async likeThread(threadId, sessionId) {
        return this.likeRepository.save({
            thread: threadId,
            author: sessionId,
        });
    }

    async likeReply(replyId, sessionId) {
        return this.likeRepository.save({
            reply: replyId,
            author: sessionId,
        });
    }
})();
