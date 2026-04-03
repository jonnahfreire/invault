import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MaxLength, MinLength } from "class-validator";

export class CreateClientAccountDto {
  @MaxLength(150, { message: "Name max length is 150" })
  @ApiProperty({ example: "Jonh Doe", description: "Client's Name", required: true })
  declare name: string;

  @MaxLength(50, { message: "Email max length is 50" })
  @IsEmail()
  @ApiProperty({ example: "jonh.doe@gmail.com", description: "Client's Email", required: true })
  declare email: string;

  @MinLength(6)
  @MaxLength(20, { message: "Password max length is 20" })
  @ApiProperty({ example: "password@123", description: "Client acccount password", required: true })
  declare password: string;
}
