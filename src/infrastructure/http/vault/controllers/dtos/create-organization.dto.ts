import { ApiProperty } from "@nestjs/swagger";

export class CreateOrganizationDto {
  @ApiProperty({ example: "My Organization", description: "Organization Name" })
  name: string;
}
