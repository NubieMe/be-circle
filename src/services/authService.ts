import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import { validate } from "../utils/validator/validation";
import { loginSchema, registerSchema } from "../utils/validator/auth";
import ResponseError from "../error/responseError";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Request } from "express";

export default new (class AuthService {
    private readonly authRepository: Repository<User> = AppDataSource.getRepository(User);

    async register(reqBody: Request) {
        const isValid = validate(registerSchema, reqBody);

        const chkUser = await this.authRepository.countBy({ username: isValid.username });
        if (chkUser !== 0) throw new ResponseError(400, "Username already exist!");

        const chkEmail = await this.authRepository.countBy({ email: isValid.email });
        if (chkEmail !== 0) throw new ResponseError(400, "Email already exist!");

        const hash = await bcrypt.hash(isValid.password, 10);

        await this.authRepository.save({
            name: isValid.name,
            username: isValid.username,
            email: isValid.email,
            password: hash,
        });
        const get = await this.authRepository.findOne({ where: { username: isValid.username } });

        const token = jwt.sign({ id: get.id, username: get.username }, process.env.SECRET_KEY, {
            expiresIn: "7d",
        });
        return {
            message: "Account created",
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
        const chkEmail = await this.authRepository.findOne({
            where: { email: isValid.username },
            select: {
                id: true,
                username: true,
                password: true,
            },
        });
        if (!chkUser && !chkEmail) throw new ResponseError(401, "Username/Email not registered yet!");

        let isEqual;
        let token;
        if (!chkUser && chkEmail) {
            isEqual = await bcrypt.compare(isValid.password, chkEmail.password);
            if (!isEqual) throw new ResponseError(401, "Email or Password is not correct!");

            token = jwt.sign({ id: chkEmail.id, username: chkEmail.username }, process.env.SECRET_KEY, {
                expiresIn: "7d",
            });
        } else if (!chkEmail && chkUser) {
            isEqual = await bcrypt.compare(isValid.password, chkUser.password);
            if (!isEqual) throw new ResponseError(401, "Username or Password is not correct!");

            token = jwt.sign({ id: chkUser.id, username: chkUser.username }, process.env.SECRET_KEY, {
                expiresIn: "7d",
            });
        }

        return {
            message: "Login success",
            token: token,
        };
    }
})();
