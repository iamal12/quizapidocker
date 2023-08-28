import { Category } from "src/categories/entities/category.entity";
import { BaseEntity } from "src/database/base-entity";
import { Column, Entity, ManyToOne } from "typeorm";


@Entity()
export class Question extends BaseEntity {
    @Column()
    questionText: string

    @Column("text", { array: true })
    options: string[]


    @Column()
    correctAnswer: string


    @ManyToOne(() => Category, (category) => category.questions)
    category: Category
}
