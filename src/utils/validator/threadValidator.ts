import joi = require("joi");

export const createThreadSchema = joi.object({
    content: joi.string().max(160).optional(),
    image: joi.string().optional(),
    author: joi.number().required(),
});

export const updateThreadSchema = joi.object({
    content: joi.string().max(160).optional(),
    image: joi.string().optional(),
    updated_at: joi.date().default(new Date()),
});
