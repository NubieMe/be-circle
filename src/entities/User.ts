import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Thread } from "./Thread";
import { Reply } from "./Reply";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    picture: string;

    @Column({ nullable: true })
    cover_photo: string;

    @Column({ nullable: true })
    bio: string;

    @OneToMany(() => Thread, (thread) => thread.created_by)
    threads: Thread[];

    @OneToMany(() => Reply, (reply) => reply.created_by)
    replies: Reply[];

    @Column({ default: () => "NOW()" })
    created_at: Date;
}
