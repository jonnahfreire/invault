import { ApiProperty } from "@nestjs/swagger";

export class CreateClientAccountDto {
  @ApiProperty({ example: "Jonh Doe", description: "Client Name", required: true })
  name: string;

  @ApiProperty({ example: "jonh.doe@gmail.com", description: "Client Email", required: true })
  email: string;

  @ApiProperty({ example: "password@123", description: "Client acccount password", required: true })
  password: string;
}
