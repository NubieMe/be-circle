import { Equal, In, Not, Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import ResponseError from "../error/responseError";
import * as bcrypt from "bcrypt";
import threadService from "./threadService";
import { Follow } from "../entities/Follow";
import cloudinary from "../libs/cloudinary";
import { redisClient } from "../libs/redis";

export default new (class UserService {
    private readonly userRepository: Repository<User> = AppDataSource.getRepository(User);

    async getUsers(name) {
        return await this.userRepository.query(
            `SELECT * FROM users WHERE name ILIKE '%${name}%' OR username ILIKE '%${name}%';`
        );
    }

    async getUser(username) {
        const response = await this.userRepository.findOne({
            where: { username },
            relations: {
                threads: true,
                follower: true,
                following: true,
                likes: true,
                replies: true,
            },
            select: {
                threads: true,
                follower: true,
                following: true,
                likes: true,
                replies: true,
            },
        });
        const threads = response.threads
            .slice(0)
            .reverse()
            .map(async (val) => await threadService.getThread(val.id));

        return {
            id: response.id,
            name: response.name,
            username: response.username,
            bio: response.bio,
            picture: response.picture,
            cover: response.cover,
            follower: response.follower,
            following: response.following,
            threads: await Promise.all(threads),
            created_at: response.created_at,
        };
    }

    async getCurrent(id) {
        const response = await this.userRepository.findOne({
            where: { id },
            relations: {
                follower: true,
                following: true,
            },
        });

        const follower = await AppDataSource.getRepository(Follow).find({
            where: { follower: Equal(id) },
            relations: {
                following: true,
            },
        });

        const following = await AppDataSource.getRepository(Follow).find({
            where: { following: Equal(id) },
            relations: {
                follower: true,
            },
        });

        return {
            id: response.id,
            name: response.name,
            username: response.username,
            picture: response.picture,
            cover: response.cover,
            bio: response.bio,
            follower,
            following,
        };
    }

    async updateUser(id: number, session: number, data) {
        if (session !== id) throw new ResponseError(403, "Cannot update another user's profile");
        let user;

        if (!data.password) {
            user = {
                name: data.name,
                username: data.username,
                bio: data.bio,
            };
        } else {
            const hash = bcrypt.hash(data.password, 10);
            user = {
                name: data.name,
                username: data.username,
                password: hash,
                bio: data.bio,
            };
        }

        await this.userRepository.update({ id }, user);
        await redisClient.del("threads");
        return {
            message: "Account updated",
            user: data.username,
        };
    }

    async uploadPicture(id, session, picture) {
        if (session !== id) throw new ResponseError(403, "Cannot update another user's profile");
        if (!picture) throw new ResponseError(400, "Picture is required");

        cloudinary.config();
        const upload = (await cloudinary.upload(picture)).secure_url;

        await this.userRepository.update({ id }, { picture: upload });
        await redisClient.del("threads");
        return {
            message: "Picture uploaded",
        };
    }

    async uploadCover(id, session, cover) {
        if (session !== id) throw new ResponseError(403, "Cannot update another user's profile");
        if (!cover) throw new ResponseError(400, "Cover image is required");

        cloudinary.config();
        const upload = (await cloudinary.upload(cover)).secure_url;

        await this.userRepository.update({ id }, { cover: upload });
        return {
            message: "Cover uploaded",
        };
    }

    async suggestion(id: number) {
        const following = await this.userRepository.find({
            where: { follower: { following: Equal(id) } },
            select: { id: true },
        });

        const follow = [];
        let i = 0;
        const len = following.length;
        for (i; i < len; i++) {
            follow.push(following[i].id);
        }
        follow.push(id);

        return this.userRepository.find({
            where: {
                id: Not(In(follow.map((val) => val))),
            },
            take: 5,
        });
    }

    async deleteUser(id, session, password) {
        if (session !== id) throw new ResponseError(403, "Cannot delete another user's Account");
        const user = await this.userRepository.findOne({ where: { id }, select: password });

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) throw new ResponseError(400, "Wrong password");

        await this.userRepository.delete({ id });
        await redisClient.del("threads");
        return {
            message: "Account deleted",
        };
    }
})();
