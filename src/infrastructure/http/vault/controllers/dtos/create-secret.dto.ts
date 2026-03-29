import { SecretOwner } from "@domain/secret/enum/secret-owner.enum";
import { SecretType } from "@domain/secret/enum/secret-type.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSecretDto {
  @ApiProperty({ example: "My Secret", description: "Name of the secret" })
  name: string;

  @ApiProperty({ example: "apikey", description: "Type of the secret", type: String, enum: ["kv", "database", "apikey", "ssh", "certificate"] })
  type: SecretType;

  @ApiProperty({ example: "c9f5-43a5-b564-5aed72169a0b", description: "ID of the owner this secret belongs to" })
  ownerId: string;

  @ApiProperty({ example: "application", description: "Type of the owner", type: String, enum: ["user", "application", "organization"] })
  ownerType: SecretOwner;

  @ApiProperty({ example: { apiKey: "supersecretkey" }, description: "Initial data for the secret, structure depends on the secret type" })
  initialData: Record<string, any>;

  @ApiProperty({ example: "d79ce194-92b7-41f9-bd22-59bb4c0b0af1", description: "ID of the actor creating the secret", required: false })
  createdBy?: string;

  @ApiProperty({ example: "2024-12-31T23:59:59Z", description: "Expiration date of the secret version", required: false })
  expiresAt?: Date;
}
