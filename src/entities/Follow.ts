import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Follow {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.id)
    follower: User[];

    @ManyToOne(() => User, (user) => user.id)
    following: User[];
}
