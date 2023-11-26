import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTournamentDto {
    @ApiProperty({description: 'Tournament name'})
    @IsString()
    name:string
    
    @ApiProperty({description: 'Description'})
    @IsString()
    description:string

    @ApiProperty({description: 'Start time'})
    @Transform(({value})=>new Date(value))
    @IsDate()
    startTime: Date


    @ApiProperty({description: 'category'})
    @IsNumber()
    category: number
}
