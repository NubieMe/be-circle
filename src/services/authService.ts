import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import { validate } from "../utils/validator/validation";
import { loginSchema, registerSchema } from "../utils/validator/authValidator";
import ResponseError from "../error/responseError";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Request } from "express";
import followService from "./followService";

export default new (class AuthService {
    private readonly authRepository: Repository<User> = AppDataSource.getRepository(User);

    async register(reqBody: Request) {
        const isValid = validate(registerSchema, reqBody);

        const chkUser = await this.authRepository.countBy({ username: isValid.username });
        if (chkUser !== 0) throw new ResponseError(400, "Username already exist!");

        const hash = await bcrypt.hash(isValid.password, 10);

        await this.authRepository.save({
            username: isValid.username,
            password: hash,
            name: isValid.name,
        });

        const get = await this.authRepository.findOne({ where: { username: isValid.username } });
        await followService.createFollow(get.id);

        const token = jwt.sign({ id: get.id, username: get.username }, process.env.SECRET_KEY, {
            expiresIn: "7d",
        });
        return {
            message: "Account created",
            user: {
                id: get.id,
                username: get.username,
            },
            token: token,
        };
    }

    async login(reqBody: Request) {
        const isValid = validate(loginSchema, reqBody);

        const chkUser = await this.authRepository.findOne({
            where: { username: isValid.username },
            select: {
                id: true,
                username: true,
                password: true,
            },
        });
        if (!chkUser) throw new ResponseError(401, "Username not registered yet!");

        const isEqual = await bcrypt.compare(isValid.password, chkUser.password);
        if (!isEqual) throw new ResponseError(401, "Username or Password is not correct!");

        const token = jwt.sign({ id: chkUser.id, username: chkUser.username }, process.env.SECRET_KEY, {
            expiresIn: "7d",
        });
        return {
            message: "Login success",
            user: {
                id: chkUser.id,
                username: chkUser.username,
            },
            token: token,
        };
    }
})();
