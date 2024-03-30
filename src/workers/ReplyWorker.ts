import * as amqp from "amqplib";
import cloudinary from "../libs/cloudinary";
import { EventEmitter } from "stream";
import { request } from "http";
import ResponseError from "../error/responseError";
import { AppDataSource } from "../data-source";
import { Reply } from "../entities/Reply";

export default new (class ReplyWorker extends EventEmitter {
    async create(queue: string, connection: amqp.Connection) {
        try {
            const channel = await connection.createChannel();

            await channel.assertQueue(queue);
            await channel.consume(queue, async (message) => {
                if (message) {
                    const data = JSON.parse(message.content.toString());
                    let payload;

                    if (data.image && data.content) {
                        cloudinary.config();
                        const upFile = await cloudinary.upload(data.image);

                        payload = {
                            content: data.content,
                            image: upFile.secure_url,
                            author: data.author,
                            thread: data.thread,
                        };
                    } else if (!data.image && data.content) {
                        payload = {
                            content: data.content,
                            author: data.author,
                            thread: data.thread,
                        };
                    } else if (data.image && !data.content) {
                        cloudinary.config();
                        const upFile = await cloudinary.upload(data.image);

                        payload = {
                            image: upFile.secure_url,
                            author: data.author,
                            thread: data.thread,
                        };
                    } else {
                        throw new ResponseError(400, "Content or Image is required");
                    }

                    await AppDataSource.getRepository(Reply).save(payload);

                    const req = request({
                        hostname: "localhost",
                        port: 5000,
                        path: "/api/v1/new-reply",
                        method: "GET",
                    });

                    req.on("error", (error) => console.log("message: " + error.message));
                    req.end();
                    console.log("reply is created");
                    channel.ack(message);
                }
            });
        } catch (error) {
            throw error;
        }
    }
})();
