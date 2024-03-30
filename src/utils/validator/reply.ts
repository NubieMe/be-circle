import joi = require("joi");

export const replyThreadSchema = joi.object({
    content: joi.string().max(160).optional().allow(""),
    image: joi.string().optional(),
    thread: joi.number().required(),
    author: joi.number().required(),
});
