import { ApiProperty } from "@nestjs/swagger";
import { MaxLength } from "class-validator";

export class AddShareDto {
  @MaxLength(200, { message: "Share max length is 200" })
  @ApiProperty({ description: "Share to be added" })
  declare share: string;
}
