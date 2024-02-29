import { Request, Response, Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";
import threadRoutes from "./thread";
import likeRoutes from "./like";
import replyRoutes from "./reply";
import followRoutes from "./follow";

const routes = Router();

routes.use("/", authRoutes);
routes.use("/", userRoutes);
routes.use("/", threadRoutes);
routes.use("/", likeRoutes);
routes.use("/", replyRoutes);
routes.use("/", followRoutes);

//notif sse
routes.get("/notification", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write("event: message\n");
    function sendNotification(data: any) {
        res.write("data: " + data + "\n\n");
    }

    routes.get("/new-thread", (req, res) => {
        const thread = JSON.stringify({ message: "New Thread" });
        sendNotification(thread);

        res.status(200);
    });
});

export default routes;
