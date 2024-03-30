import joi = require("joi");

export const createThreadSchema = joi.object({
    content: joi.string().max(160).optional().allow(""),
    image: joi.array().optional(),
    author: joi.number().required(),
});

export const updateThreadSchema = joi.object({
    content: joi.string().max(160).optional(),
    image: joi.array().optional(),
    updated_at: joi.date().default(new Date()),
});
