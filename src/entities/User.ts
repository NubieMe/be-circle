import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Thread } from "./Thread";
import { Reply } from "./Reply";
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

    @OneToMany(() => Follow, (follow) => follow.id)
    follow: Follow;

    @OneToMany(() => Thread, (thread) => thread.created_by)
    threads: Thread[];

    @OneToMany(() => Reply, (reply) => reply.created_by)
    replies: Reply[];

    @Column({ default: () => "NOW()" })
    created_at: Date;
}
