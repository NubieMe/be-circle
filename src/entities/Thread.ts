import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Like } from "./Like";
import { Reply } from "./Reply";

@Entity({ name: "threads" })
export class Thread {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 160, nullable: true })
    content: string;

    @Column({ nullable: true })
    image: string;

    @OneToMany(() => Like, (like) => like.thread)
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

    @Column({ nullable: true })
    updated_at: Date;
}
