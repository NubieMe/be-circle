import { AppDataSource } from "../data-source";
import cloudinary from "../libs/cloudinary";
import * as amqp from "amqplib";
import "dotenv/config";
import ThreadWorker from "./ThreadWorker";
import ReplyWorker from "./ReplyWorker";

export default new (class WorkerHub {
    constructor() {
        AppDataSource.initialize()
            .then(async () => {
                // cloudinary.config();

                const connection = await amqp.connect("amqp://localhost");
                ThreadWorker.create("thread_queue", connection);
                ReplyWorker.create("reply_queue", connection);
                console.log("Worker is running!");
            })
            .catch((error) => console.log(error));
    }
})();
