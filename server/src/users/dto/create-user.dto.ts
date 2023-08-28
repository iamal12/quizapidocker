import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ description: 'Name of the user' })
    name: string

    @ApiProperty({ type: 'number', description: 'Mobile number of the user' })
    mobileNo: number

    @ApiProperty({ type: String, format: 'email', description: 'Email of the user' })
    email: string

    @ApiProperty({type:'string', description: 'User password'})
    password:string

}
