import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { CreateOrganizationDto } from "../dtos/create-organization.dto";
import CreateOrganizationUseCase from "@application/usecases/organization/create-organization.usecase";

@Throttle({ default: { ttl: 1000, limit: 1 } })
@ApiTags("Organization")
@Controller("organization")
export class OrganizationController {
  constructor(private readonly createOrganization: CreateOrganizationUseCase) {}

  @Post("/")
  @ApiOperation({ summary: "Add a new organization", operationId: "createOrganization" })
  async addShare(@Body() body: CreateOrganizationDto) {
    // TODO: Get OwnerId from Authnticated User
    await this.createOrganization.execute({ ...body, ownerId: "" });
    return { message: "Organization created successfully" };
  }
}
