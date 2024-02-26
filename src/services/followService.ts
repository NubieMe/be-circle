import { Equal, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Follow } from "../entities/Follow";
import { User } from "../entities/User";

export default new (class FollowService {
    private readonly followRepository: Repository<Follow> = AppDataSource.getRepository(Follow);

    async getFollow(id) {
        const follower = await AppDataSource.getRepository(User).find({
            where: { following: { follower: Equal(id) } },
            relations: {
                following: true,
            },
        });
        const following = await AppDataSource.getRepository(User).find({
            where: { follower: { following: Equal(id) } },
            relations: {
                follower: true,
            },
        });

        return {
            follower,
            following,
        };
    }

    async follow(follower, following) {
        await this.followRepository.save({ following, follower });
        return {
            message: "Follow success",
        };
    }

    async unfollow(follower, following) {
        const getFollow = await this.followRepository.findOne({
            where: { following: Equal(following), follower: Equal(follower) },
            relations: {
                following: true,
                follower: true,
            },
        });
        await this.followRepository.delete(getFollow.id);
        return {
            message: "Unfollow success",
        };
    }
})();
