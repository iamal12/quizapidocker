import { ApiProperty } from "@nestjs/swagger";

export class CreateQuestionDto {
    @ApiProperty({description: 'Question'})
    questionText: string

    @ApiProperty({type: Array, description: 'Options'})
    options: string[]

    @ApiProperty({description: "Answer"})
    correctAnswer: string
}
