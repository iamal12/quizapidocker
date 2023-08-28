import { BaseEntity } from "src/database/base-entity";
import { Column, Entity } from "typeorm";
import { TournementStatus } from "./status.enum";

@Entity()
export class Tournement extends BaseEntity {
    
    @Column()
    tournamentName: string

    @Column()
    tournamentDescription: string

    @Column({type: 'date'})
    startTime: string

    @Column({type: 'date'})
    endTime: string

    @Column({type: 'enum',enum: TournementStatus})
    status: TournementStatus

    @Column({type: 'integer'})
    rounds: number

    @Column({type: 'integer'})
    maxSlots: number
}
