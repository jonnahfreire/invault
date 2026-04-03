import { ApiProperty } from "@nestjs/swagger";

export class AddShareDto {
  @ApiProperty({ description: "Share to be added" })
  share: string;
}
