import { Equal, Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Follow } from "../entities/Follow";
import { User } from "../entities/User";
import ResponseError from "../error/responseError";

export default new (class FollowService {
    private readonly followRepository: Repository<Follow> = AppDataSource.getRepository(Follow);

    async getFollows(id) {
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
        const wer = await Promise.all(
            follower.map(async (val) => {
                const isFollow = await this.getFollow(val.id, id);

                return {
                    ...val,
                    isFollow,
                };
            })
        );
        const wing = following.map((val) => {
            return {
                ...val,
                isFollow: true,
            };
        });

        return {
            follower: wer,
            following: wing,
        };
    }

    async getFollow(follower, following) {
        const check = await this.followRepository.count({
            where: {
                following: Equal(following),
                follower: Equal(follower),
            },
        });
        if (check !== 0) return true;
        return false;
    }

    async follow(follower, following) {
        const chkFollow = await this.followRepository.countBy({
            following: Equal(following),
            follower: Equal(follower),
        });
        if (chkFollow) throw new ResponseError(400, "You already follow this User");
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
        if (!getFollow) throw new ResponseError(400, "You already unfollow this User");
        await this.followRepository.delete(getFollow.id);
        return {
            message: "Unfollow success",
        };
    }
})();
