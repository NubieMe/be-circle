import joi = require("joi");

export const registerSchema = joi.object({
    username: joi.string().max(100).required(),
    password: joi.string().max(100).required(),
    name: joi.string().max(100).required(),
});

export const loginSchema = joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
});
