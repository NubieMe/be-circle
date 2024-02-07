import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Thread } from "./Thread";

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

    @OneToMany(() => Thread, (thread) => thread.user)
    threads: Thread[];

    @ManyToOne(() => User, (user) => user.id)
    follower: User[];

    @ManyToOne(() => User, (user) => user.id)
    following: User[];
}
