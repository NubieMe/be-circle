import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Like } from "./Like";
import { Reply } from "./Reply";

@Entity()
export class Thread {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 160 })
    content: string;

    @Column({ nullable: true })
    image: string;

    @OneToMany(() => Like, (like) => like.id)
    likes: Like[];

    @OneToMany(() => Reply, (reply) => reply.id)
    replies: Reply[];

    @ManyToOne(() => User, (user) => user.id, {
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
    })
    created_by: User;

    @Column({ default: () => "NOW()" })
    created_at: Date;
}
