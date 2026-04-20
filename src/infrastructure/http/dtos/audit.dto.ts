import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional, IsUUID, Max, MaxLength, Min } from "class-validator";

export class QueryAuditEventsDto {
  @ApiPropertyOptional({ description: "Organization scope (owner/admin only)", format: "uuid" })
  @IsOptional()
  @IsUUID()
  declare organizationId?: string;

  @ApiPropertyOptional({ description: "Filter by actor ID (defaults to authenticated user)", format: "uuid" })
  @IsOptional()
  @IsUUID()
  declare actorId?: string;

  @ApiPropertyOptional({ description: "Filter by action name", example: "secret.updated" })
  @IsOptional()
  @MaxLength(120)
  declare action?: string;

  @ApiPropertyOptional({ description: "Filter by resource ID", format: "uuid" })
  @IsOptional()
  @IsUUID()
  declare resourceId?: string;

  @ApiPropertyOptional({ description: "Start date (ISO 8601)", example: "2026-04-01T00:00:00.000Z" })
  @IsOptional()
  @IsDateString()
  declare startDate?: string;

  @ApiPropertyOptional({ description: "End date (ISO 8601)", example: "2026-04-30T23:59:59.999Z" })
  @IsOptional()
  @IsDateString()
  declare endDate?: string;

  @ApiPropertyOptional({ description: "Page number (1-based)", default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  declare page?: number;

  @ApiPropertyOptional({ description: "Page size", default: 20, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  declare pageSize?: number;
}
