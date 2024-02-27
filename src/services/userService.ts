import { Equal, Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import ResponseError from "../error/responseError";
import * as bcrypt from "bcrypt";
import threadService from "./threadService";
import { Follow } from "../entities/Follow";

export default new (class UserService {
    private readonly userRepository: Repository<User> = AppDataSource.getRepository(User);

    async getUsers(name) {
        return this.userRepository.query(
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
        const threads = response.threads.map(async (val) => await threadService.getThread(val.id, response.id));

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
        return {
            message: "Account updated",
            user: data.username,
        };
    }

    async uploadPicture(id, session, picture) {
        if (session !== id) throw new ResponseError(403, "Cannot update another user's profile");
        await this.userRepository.update({ id }, { picture });
        return {
            message: "Picture uploaded",
        };
    }

    async uploadCover(id, session, cover) {
        if (session !== id) throw new ResponseError(403, "Cannot update another user's profile");
        await this.userRepository.update({ id }, { cover });
        return {
            message: "Cover uploaded",
        };
    }

    async deleteUser(id, session, password) {
        if (session !== id) throw new ResponseError(403, "Cannot delete another user's Account");
        const user = await this.userRepository.findOne({ where: { id }, select: password });

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) throw new ResponseError(400, "Wrong password");

        await this.userRepository.delete({ id });
        return {
            message: "Account deleted",
        };
    }
})();
