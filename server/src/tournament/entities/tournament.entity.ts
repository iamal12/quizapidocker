import { Category } from "src/categories/entities/category.entity";
import { BaseEntity } from "src/database/base-entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";

@Entity()
export class Tournament extends BaseEntity {
    @Column()
    name: string;

    @Column()
    description: string

    @Column({ type: 'timestamp' })
    startTime: Date

    @ManyToMany(() => User, { nullable: true })
    @JoinTable()
    users: User[]

    @ManyToOne(() => Category)
    category: Category

    @Column({ type: 'integer', default: 2 })
    maxNumber: number
}
