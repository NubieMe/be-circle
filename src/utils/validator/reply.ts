import joi = require("joi");

export const replyThreadSchema = joi.object({
    content: joi.string().max(160).optional(),
    image: joi.string().optional(),
    thread: joi.number().required(),
    author: joi.number().required(),
});

export const repliesReplySchema = joi.object({
    content: joi.string().max(160).optional(),
    image: joi.string().optional(),
    reply: joi.number().required(),
    author: joi.number().required(),
});

export const updateThreadSchema = joi.object({
    content: joi.string().max(160).optional(),
    image: joi.string().optional(),
    updated_at: joi.date().default(new Date()),
});
