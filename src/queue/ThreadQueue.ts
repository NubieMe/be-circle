import rabbitmq from "../libs/rabbitmq";
import { createThreadSchema } from "../utils/validator/thread";
import { validate } from "../utils/validator/validation";
import ResponseError from "../error/responseError";

export default new (class ThreadQueue {
    async create(data) {
        try {
            const isValid = validate(createThreadSchema, data);

            const error = await rabbitmq.sendToQ(process.env.QUEUE_NAME, isValid);
            if (error) throw new ResponseError(500, "error while sending to queue");

            return {
                message: "Thread Queued",
                data: isValid,
            };
        } catch (error) {
            throw error;
        }
    }
})();
