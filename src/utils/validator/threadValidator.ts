import joi = require("joi");

export const createThreadSchema = joi.object({
    content: joi.string().max(160).required(),
    image: joi.string().optional(),
    created_by: joi.number().required(),
});

export const updateThreadSchema = joi.object({
    content: joi.string().max(160).required(),
    image: joi.string().optional(),
    updated_at: joi.date().default(Date.now()),
});
