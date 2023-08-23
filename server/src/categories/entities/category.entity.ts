import { Question } from "src/questions/entities/question.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "src/database/base-entity";

@Entity()
export class Category extends BaseEntity {

    @Column()
    categoryName: string

    @OneToMany(() => Question, question => question.category)
    questions: Question[]

}
