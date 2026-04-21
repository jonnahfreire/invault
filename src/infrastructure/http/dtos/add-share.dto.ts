import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches, MaxLength } from "class-validator";

export class AddShareDto {
  @IsNotEmpty({ message: "Share is required" })
  @MaxLength(200, { message: "Share max length is 200" })
  @Matches(/^[a-fA-F0-9]+$/, { message: "Share must be a hex string" })
  @ApiProperty({ description: "Share to be added" })
  declare share: string;
}
