import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Like } from "./Like";
import { Reply } from "./Reply";

@Entity({ name: "threads" })
export class Thread {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 160 })
    content: string;

    @Column({ nullable: true })
    image: string;

    @OneToMany(() => Like, (like) => like.id, {
        eager: true,
    })
    likes: Like[];

    @OneToMany(() => Reply, (reply) => reply.id, {
        eager: true,
    })
    replies: Reply[];

    @ManyToOne(() => User, (user) => user.id, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
    })
    author: User;

    @Column({ default: () => "NOW()" })
    created_at: Date;

    @Column({ default: () => "NOW()" })
    updated_at: Date;
}
