import { ApiProperty } from "@nestjs/swagger";
import { MaxLength } from "class-validator";

export class CreateOrganizationDto {
  @MaxLength(50, { message: "Organization Name max length is 50" })
  @ApiProperty({ example: "Umbrella Corporation", description: "Organization Name" })
  declare name: string;
}
