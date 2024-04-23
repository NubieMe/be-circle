import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Thread } from "./Thread";
import { Reply } from "./Reply";
import { Like } from "./Like";
import { Follow } from "./Follow";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ unique: true, length: 100 })
    username: string;

    @Column({ unique: true, length: 100 })
    email: string;

    @Column({ length: 255, select: false })
    password: string;

    @Column({ nullable: true, default: "https://res.cloudinary.com/dydmnzkfh/image/upload/v1713671817/ekv4nylpxrwvmacu2cbj.jpg" })
    picture: string;

    @Column({ nullable: true })
    cover: string;

    @Column({ nullable: true })
    bio: string;

    @OneToMany(() => Follow, (follow) => follow.follower)
    follower: Follow[];

    @OneToMany(() => Follow, (follow) => follow.following)
    following: Follow[];

    @OneToMany(() => Thread, (thread) => thread.author)
    threads: Thread[];

    @OneToMany(() => Like, (like) => like.author)
    likes: Like[];

    @OneToMany(() => Reply, (reply) => reply.author)
    replies: Reply[];

    @Column({ default: () => "NOW()" })
    created_at: Date;
}
