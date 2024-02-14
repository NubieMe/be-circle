import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Follow } from "../entities/Follow";
import { User } from "../entities/User";

export default new (class FollowService {
    private readonly followRepository: Repository<Follow> = AppDataSource.getRepository(Follow);

    async getFollow(id) {
        const response = await AppDataSource.getRepository(User).findOne({
            where: { id },
            relations: {
                following: true,
                follower: true,
            },
            select: {
                following: true,
                follower: true,
            },
        });

        const follower = response.follower.map(
            async (x) =>
                await AppDataSource.getRepository(User).findOne({
                    where: { id: x.id },
                    relations: {
                        following: true,
                        follower: true,
                    },
                    select: {
                        follower: true,
                        following: true,
                    },
                })
        );

        const following = response.following.map(
            async (x) =>
                await AppDataSource.getRepository(User).findOne({
                    where: { id: x.id },
                    relations: {
                        following: true,
                        follower: true,
                    },
                    select: {
                        follower: true,
                        following: true,
                    },
                })
        );

        return {
            follower: await Promise.all(follower),
            following: await Promise.all(following),
        };
    }

    async createFollow(id) {
        return this.followRepository.save({
            user: id,
        });
    }

    async follow(following, follower) {
        await this.followRepository.update({ id: follower }, { follower: following.following });
        await this.followRepository.update({ id: following.following }, { following: follower });
        return {
            message: "Follow success",
        };
    }

    // async unfollow(following, follower) {
    //     await this.followRepository.
    // }
})();
