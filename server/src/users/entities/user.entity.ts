import { BaseEntity } from "src/database/base-entity";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @Column()
    name: string

    @Column()
    mobileNo: number

    @Column({ unique: true })
    email: string
}
