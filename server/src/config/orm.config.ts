import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import 'dotenv/config'

export const ormConfig: PostgresConnectionOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    subscribers: ["dist/subscribers/**/*{.js,.ts}"],
    synchronize: false,
    logging: ['error', 'warn', 'migration'],
    migrationsRun: true
}
