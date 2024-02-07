import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import ResponseError from "../error/responseError";
import * as bcrypt from "bcrypt";

export default new (class UserService {
    private readonly userRepostory: Repository<User> = AppDataSource.getRepository(User);

    async getUsers() {
        return;
    }

    async getUser(id) {
        return this.userRepostory
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.threads", "threads")
            .where("user.id = :id", id)
            .select([
                "user.id",
                "user.username",
                "user.fullName",
                "user.address",
                "user.gender",
                "user.paslon",
                "user.isAdmin",
                "paslon.id",
                "paslon.name",
            ])
            .getOne();
    }

    async update(id: number, data, session: number) {
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

        const response = await this.userRepostory.update(id, user);

        return {
            message: "Account updated",
            user: data.username,
        };
    }
})();
