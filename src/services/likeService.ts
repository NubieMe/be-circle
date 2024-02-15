import { Repository } from "typeorm";
import { Like } from "../entities/Like";

export default new (class likeService {
    private readonly likeRepository: Repository<Like> = AppDataSource.getRepository(Like);
})();
