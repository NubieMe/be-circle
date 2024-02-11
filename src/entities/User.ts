import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
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

    @Column({ length: 100 })
    username: string;

    @Column({ length: 255 })
    password: string;

    @Column({ nullable: true })
    picture: string;

    @Column({ nullable: true })
    cover_photo: string;

    @Column({ nullable: true })
    bio: string;

    @OneToOne(() => Follow)
    @JoinColumn()
    follow: Follow;

    @OneToMany(() => Thread, (thread) => thread.author)
    threads: Thread[];

    @OneToMany(() => Like, (like) => like.user_id)
    likes: Like[];

    @OneToMany(() => Reply, (reply) => reply.author)
    replies: Reply[];

    @Column({ default: () => "NOW()" })
    created_at: Date;
}
