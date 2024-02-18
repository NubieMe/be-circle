import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import ResponseError from "../error/responseError";
import * as bcrypt from "bcrypt";

export default new (class UserService {
    private readonly userRepository: Repository<User> = AppDataSource.getRepository(User);

    async getUsers() {
        return this.userRepository.find();
    }

    async getUser(username) {
        return this.userRepository.findOne({
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
    }

    async getCurrent(id) {
        return this.userRepository.findOne({
            where: { id },
            relations: {
                follower: true,
                following: true,
            },
            select: {
                follower: true,
                following: true,
            },
        });
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
