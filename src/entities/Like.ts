import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Thread } from "./Thread";

@Entity()
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Thread, (thread) => thread.id)
    thread_id: Thread;

    @OneToMany(() => User, (user) => user.id)
    user_id: User;
}
