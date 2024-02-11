import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "follows" })
export class Follow {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.name)
    follower: User[];

    @ManyToOne(() => User, (user) => user.name)
    following: User[];
}
