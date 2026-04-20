import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  @MaxLength(50, { message: "Email max length is 50" })
  @ApiProperty({ example: "jonh.doe@gmail.com", description: "User email", required: true })
  declare email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20, { message: "Password max length is 20" })
  @ApiProperty({ example: "password@123", description: "User password", required: true })
  declare password: string;
}
