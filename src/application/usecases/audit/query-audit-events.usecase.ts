import IllegalAccessException from "@application/exceptions/illegal-access.exception";
import IllegalArgumentException from "@application/exceptions/illegal-argument.exception";
import { UniqueId } from "@domain/@common/uniqueid";
import IAuditRepository from "@domain/audit/audit.repository";
import IApplicationRepository from "@domain/application/application.repository";
import { IMembershipRepository } from "@domain/organization/membership.repository";
import { ISecretRepository } from "@domain/secret/secret.repository";
import { Injectable } from "@nestjs/common";

interface Input {
  requesterId: string;
  organizationId?: string;
  actorId?: string;
  action?: string;
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

@Injectable()
export default class QueryAuditEventsUseCase {
  constructor(
    private readonly auditRepository: IAuditRepository,
    private readonly applicationRepository: IApplicationRepository,
    private readonly membershipRepository: IMembershipRepository,
    private readonly secretRepository: ISecretRepository,
  ) {}

  async execute(input: Input) {
    const page = input.page && input.page > 0 ? input.page : 1;
    const pageSize = input.pageSize && input.pageSize > 0 ? Math.min(input.pageSize, 100) : 20;

    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      throw new IllegalArgumentException("startDate must be less than or equal to endDate");
    }

    const organizationId = input.organizationId ? UniqueId.from(input.organizationId) : undefined;
    const resourceId = input.resourceId ? UniqueId.from(input.resourceId) : undefined;

    if (organizationId) {
      const membership = await this.membershipRepository.findByUserAndOrganization(UniqueId.from(input.requesterId), organizationId);
      if (!membership) throw new IllegalAccessException("Unauthorized: you are not a member of this organization");

      const isOwnerOrAdmin = membership.props.roles?.some((r) => r.props.name === "owner" || r.props.name === "admin");
      if (!isOwnerOrAdmin) throw new IllegalAccessException("Unauthorized: insufficient permissions to query organization audit events");

      const applications = await this.applicationRepository.findAllByOrganizationId(organizationId);
      const applicationIds = applications.map((app) => app.id);

      const appSecrets = await Promise.all(applicationIds.map((appId) => this.secretRepository.findAllByOwnerId(appId)));
      const organizationSecrets = await this.secretRepository.findAllByOwnerId(organizationId);

      const resourceMap = new Map<string, UniqueId>();
      resourceMap.set(organizationId.toString(), organizationId);
      for (const appId of applicationIds) resourceMap.set(appId.toString(), appId);
      for (const secret of appSecrets.flat()) resourceMap.set(secret.id.toString(), secret.id);
      for (const secret of organizationSecrets) resourceMap.set(secret.id.toString(), secret.id);

      const scopedResourceIds = Array.from(resourceMap.values());

      if (resourceId && !resourceMap.has(resourceId.toString())) {
        return {
          items: [],
          pagination: {
            total: 0,
            page,
            pageSize,
            totalPages: 0,
          },
        };
      }

      const result = await this.auditRepository.query({
        actorId: input.actorId ? UniqueId.from(input.actorId) : undefined,
        action: input.action,
        resourceIds: resourceId ? [resourceId] : scopedResourceIds,
        startDate: input.startDate,
        endDate: input.endDate,
        page,
        pageSize,
      });

      return {
        items: result.items.map((event) => ({
          id: event.id.toString(),
          actorId: event.actorId.toString(),
          action: event.action,
          resourceId: event.resourceId.toString(),
          timestamp: event.timestamp,
          metadata: event.metadata,
          previousHash: event.previousHash,
          currentHash: event.currentHash,
        })),
        pagination: {
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          totalPages: Math.ceil(result.total / result.pageSize),
        },
      };
    }

    if (input.actorId && input.actorId !== input.requesterId) {
      throw new IllegalAccessException("Unauthorized: cannot query audit events for another user");
    }

    const result = await this.auditRepository.query({
      actorId: input.actorId ? UniqueId.from(input.actorId) : UniqueId.from(input.requesterId),
      action: input.action,
      resourceId,
      startDate: input.startDate,
      endDate: input.endDate,
      page,
      pageSize,
    });

    return {
      items: result.items.map((event) => ({
        id: event.id.toString(),
        actorId: event.actorId.toString(),
        action: event.action,
        resourceId: event.resourceId.toString(),
        timestamp: event.timestamp,
        metadata: event.metadata,
        previousHash: event.previousHash,
        currentHash: event.currentHash,
      })),
      pagination: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: Math.ceil(result.total / result.pageSize),
      },
    };
  }
}
