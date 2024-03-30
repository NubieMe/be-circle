import ResponseError from "../error/responseError";
import rabbitmq from "../libs/rabbitmq";
import { replyThreadSchema } from "../utils/validator/reply";
import { validate } from "../utils/validator/validation";

export default new (class ReplyQueue {
    async create(data) {
        try {
            const isValid = await validate(replyThreadSchema, data);

            const error = await rabbitmq.sendToQ("reply_queue", isValid);
            if (error) throw new ResponseError(500, "error while sending to queue");

            return {
                message: "Reply Queued",
                data: isValid,
            };
        } catch (error) {
            throw error;
        }
    }
})();
