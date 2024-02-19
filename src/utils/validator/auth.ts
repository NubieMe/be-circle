import joi = require("joi");

export const registerSchema = joi.object({
    name: joi.string().max(100).required(),
    username: joi.string().max(100).required(),
    email: joi.string().email().max(100).required(),
    password: joi.string().min(8).max(100).required(),
});

export const loginSchema = joi.object({
    username: joi.string().required().label("Username/Email"),
    password: joi.string().required(),
});
