import QueryAuditEventsUseCase from "@application/usecases/audit/query-audit-events.usecase";
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { CurrentUser } from "../decorators/current-user.decorator";
import { QueryAuditEventsDto } from "../dtos/audit.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Throttle({ default: { ttl: 1000, limit: 10 } })
@ApiTags("Audit")
@ApiSecurity("Bearer")
@UseGuards(JwtAuthGuard)
@Controller("audit")
export class AuditController {
  constructor(private readonly queryAuditEvents: QueryAuditEventsUseCase) {}

  @Get("/events")
  @ApiOperation({ summary: "Query audit events", operationId: "queryAuditEvents" })
  async queryEvents(@Query() query: QueryAuditEventsDto, @CurrentUser() user: { id: string }) {
    return this.queryAuditEvents.execute({
      requesterId: user.id,
      organizationId: query.organizationId,
      actorId: query.actorId,
      action: query.action,
      resourceId: query.resourceId,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      page: query.page,
      pageSize: query.pageSize,
    });
  }
}
