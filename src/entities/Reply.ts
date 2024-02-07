import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Like } from "./Like";

@Entity()
export class Reply {
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
        cascade: true,
    })
    user: User;

    @Column({ default: () => "NOW()" })
    created_at: Date;
}
