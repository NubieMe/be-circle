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

        return {
            follower,
            following
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

    async follow(to, from) {
        const chkFollow = await this.followRepository.countBy({
            following: Equal(from),
            follower: Equal(to),
        });
        if (chkFollow) throw new ResponseError(400, "You already follow this User");
        await this.followRepository.save({ following: from, follower: to });
        return {
            message: "Follow success",
        };
    }

    async unfollow(to, from) {
        const getFollow = await this.followRepository.findOne({
            where: { following: Equal(from), follower: Equal(to) },
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
