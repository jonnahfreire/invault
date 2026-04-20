import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiSecurity } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { CreateOrganizationDto } from "../dtos/create-organization.dto";
import { AddMemberDto } from "../dtos/application.dto";
import CreateOrganizationUseCase from "@application/usecases/organization/create-organization.usecase";
import GetOrganizationUseCase from "@application/usecases/organization/get-organization.usecase";
import ListUserOrganizationsUseCase from "@application/usecases/organization/list-user-organizations.usecase";
import AddMemberUseCase from "@application/usecases/organization/add-member.usecase";
import RemoveMemberUseCase from "@application/usecases/organization/remove-member.usecase";
import { CurrentUser } from "../decorators/current-user.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Throttle({ default: { ttl: 1000, limit: 1 } })
@ApiTags("Organization")
@ApiSecurity("Bearer")
@UseGuards(JwtAuthGuard)
@Controller("organization")
export class OrganizationController {
  constructor(
    private readonly createOrganization: CreateOrganizationUseCase,
    private readonly getOrganization: GetOrganizationUseCase,
    private readonly listUserOrganizations: ListUserOrganizationsUseCase,
    private readonly addMember: AddMemberUseCase,
    private readonly removeMember: RemoveMemberUseCase,
  ) {}

  @Post("/")
  @ApiOperation({ summary: "Create organization", operationId: "createOrganization" })
  async createOrg(@Body() body: CreateOrganizationDto, @CurrentUser() user: { id: string }) {
    await this.createOrganization.execute({ ...body, ownerId: user.id });
    return { message: "Organization created successfully" };
  }

  @Get("/list")
  @ApiOperation({ summary: "List organizations for current user", operationId: "listUserOrganizations" })
  async listOrgs(@CurrentUser() user: { id: string }) {
    return this.listUserOrganizations.execute({ userId: user.id });
  }

  @Get("/:organizationId")
  @ApiOperation({ summary: "Get organization by ID", operationId: "getOrganization" })
  async getOrg(@Param("organizationId") organizationId: string) {
    return this.getOrganization.execute({ organizationId });
  }

  @Post("/:organizationId/members")
  @ApiOperation({ summary: "Add member to organization", operationId: "addMember" })
  async addOrgMember(@Param("organizationId") organizationId: string, @Body() body: AddMemberDto, @CurrentUser() user: { id: string }) {
    await this.addMember.execute({ organizationId, targetUserId: body.userId, requesterId: user.id });
    return { message: "Member added successfully" };
  }

  @Delete("/:organizationId/members/:userId")
  @ApiOperation({ summary: "Remove member from organization", operationId: "removeMember" })
  async removeOrgMember(@Param("organizationId") organizationId: string, @Param("userId") userId: string, @CurrentUser() user: { id: string }) {
    await this.removeMember.execute({ organizationId, targetUserId: userId, requesterId: user.id });
    return { message: "Member removed successfully" };
  }
}
