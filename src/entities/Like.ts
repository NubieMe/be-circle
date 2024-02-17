import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Thread } from "./Thread";
import { Reply } from "./Reply";

@Entity({ name: "likes" })
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Thread, (thread) => thread.likes, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "thread_id" })
    thread: Thread;

    @ManyToOne(() => Reply, (reply) => reply.likes, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "reply_id" })
    reply: Reply;

    @ManyToOne(() => User, (user) => user.likes, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "author_id" })
    author: User;
}
