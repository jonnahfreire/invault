import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

export class CreateApplicationDto {
  @ApiProperty({ description: "Application name", example: "My App" })
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  declare name: string;

  @ApiProperty({ description: "Organization ID" })
  @IsNotEmpty()
  declare organizationId: string;
}

export class GenerateApiKeyDto {
  @ApiProperty({ description: "Descriptive name for this API key", example: "Production Key" })
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  declare name: string;

  @ApiPropertyOptional({ description: "Expiration date for the API key" })
  @IsOptional()
  @IsDateString()
  declare expiresAt?: Date;
}

export class AddMemberDto {
  @ApiProperty({ description: "ID of the user to add as a member" })
  @IsNotEmpty()
  declare userId: string;
}

export class UpdateSecretDto {
  @ApiProperty({ description: "New data payload for the secret" })
  @IsNotEmpty()
  declare newData: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  declare expiresAt?: Date;
}

export class CreateServiceAccountDto {
  @ApiProperty({ description: "Service account name", example: "ci-cd-agent" })
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  declare name: string;
}

export class RotateSecretDto {
  @ApiPropertyOptional({ description: "Optional new expiration date for rotated version" })
  @IsOptional()
  @IsDateString()
  declare expiresAt?: Date;
}
