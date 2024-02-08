import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import { validate } from "../utils/validator/validation";
import { loginSchema, registerSchema } from "../utils/validator/authValidator";
import ResponseError from "../error/responseError";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export default new (class AuthService {
    private readonly authrepository: Repository<User> = AppDataSource.getRepository(User);

    async register(data) {
        const isValid = validate(registerSchema, data);

        const chkUser = await this.authrepository.countBy({ username: isValid.username });
        if (chkUser !== 0) throw new ResponseError(400, "Username already exist!");

        const hash = await bcrypt.hash(isValid.password, 10);
        const user = await this.authrepository.save({
            username: isValid.username,
            password: hash,
            name: isValid.name,
        });

        const get = await this.authrepository.findOne({ where: { username: isValid.username } });

        const token = jwt.sign({ id: get.id, username: get.username }, process.env.SECRET_KEY, {
            expiresIn: "7d",
        });
        return {
            message: "Account created successfully",
            user: {
                id: get.id,
                username: get.username,
            },
            token: token,
        };
    }

    async login(data) {
        const isValid = validate(loginSchema, data);
        const chkUser = await this.authrepository.findOne({ where: { username: isValid.username } });
        if (!chkUser) throw new ResponseError(401, "Username not registered yet!");

        const isMatch = await bcrypt.compare(isValid.password, chkUser.password);
        if (!isMatch) throw new ResponseError(401, "Username or Password is not correct!");

        const token = jwt.sign({ id: chkUser.id, username: chkUser.username }, process.env.SECRET_KEY, {
            expiresIn: "7d",
        });
        return {
            message: "Account created successfully",
            user: {
                id: chkUser.id,
                username: chkUser.username,
            },
            token: token,
        };
    }
})();
