import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Like } from "./Like";
import { Thread } from "./Thread";

@Entity({ name: "replies" })
export class Reply {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 160, nullable: true })
    content: string;

    @Column({ nullable: true })
    image: string;

    @ManyToOne(() => Thread, (thread) => thread.replies, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    })
    thread: Thread;

    @ManyToOne(() => Reply, (reply) => reply.replies, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    })
    reply: Reply;

    @OneToMany(() => Like, (like) => like.reply)
    likes: Like[];

    @OneToMany(() => Reply, (reply) => reply.reply)
    replies: Reply[];

    @ManyToOne(() => User, (user) => user.id, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    })
    author: User;

    @Column({ default: () => "NOW()" })
    created_at: Date;
}
