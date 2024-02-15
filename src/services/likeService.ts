import { Repository } from "typeorm";
import { Like } from "../entities/Like";
import { AppDataSource } from "../data-source";

export default new (class likeService {
    private readonly likeRepository: Repository<Like> = AppDataSource.getRepository(Like);

    async likeThread(threadId, sessionId) {
        return this.likeRepository.save({
            thread: threadId,
            author: sessionId,
        });
    }
})();
