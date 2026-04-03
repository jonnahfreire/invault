import { UniqueId } from "@domain/@common/uniqueid";
import { SecretOwner } from "@domain/secret/enum/secret-owner.enum";
import { SecretType } from "@domain/secret/enum/secret-type.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsUUID, MaxLength, IsOptional, IsDateString } from "class-validator";

export class CreateSecretDto {
  @MaxLength(50)
  @ApiProperty({ example: "Backend Apikey", description: "Name of the secret" })
  declare name: string;

  @IsEnum(SecretType, { message: "secretType must be one of 'kv', 'database', 'apikey', 'ssh', 'certificate'" })
  @ApiProperty({ example: "apikey", description: "Type of the secret", type: String, enum: ["kv", "database", "apikey", "ssh", "certificate"] })
  declare type: SecretType;

  @IsUUID(4, { message: "ownerId must be UUID" })
  @ApiProperty({ example: UniqueId.create().toString(), description: "ID of the owner this secret belongs to" })
  declare ownerId: string;

  @IsEnum(SecretOwner, { message: "ownerType must be one of 'user', 'application', 'organization'" })
  @ApiProperty({ example: "application", description: "Type of the owner", type: String, enum: ["user", "application", "organization"] })
  declare ownerType: SecretOwner;

  @MaxLength(512)
  @ApiProperty({ example: "supersecretapikey", description: "Initial data for the secret, structure depends on the secret type" })
  declare initialData: Record<string, any>;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ example: "2028-12-31T23:59:59Z", description: "Expiration date of the secret version", required: false })
  declare expiresAt?: Date;
}
