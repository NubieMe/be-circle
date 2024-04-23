import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "roundhouse.proxy.rlwy.net",
    port: 53953,
    username: "postgres",
    password: "KKUAcfYSYVlCXsAGzAWDCunNdPGOFnur",
    database: "railway",
    synchronize: true,
    logging: false,
    entities: ["src/entities/*.ts"],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});
