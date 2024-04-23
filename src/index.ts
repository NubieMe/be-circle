import { AppDataSource } from "./data-source";
import * as express from "express";
import * as cors from "cors";
import routes from "./route";
import "dotenv/config";
import cloudinary from "./libs/cloudinary";
// import { redisClient } from "./libs/redis";

AppDataSource.initialize()
    .then(async () => {
        const app = express();

        app.use(
            cors({
                credentials: true,
                origin: "*",
                methods: ["GET", "POST", "PATCH", "DELETE"],
                allowedHeaders: ["Origin", "Content-Type", "Authorization", "Accept"],
                preflightContinue: true,
            })
        );
        app.use(express.json());
        cloudinary.config();
        app.use("/api/v1", routes);

        app.listen(process.env.PORT, async () => {
            // await redisClient.connect();
            console.log(`Server is running!`);
        });
    })
    .catch((error) => console.log(error));
