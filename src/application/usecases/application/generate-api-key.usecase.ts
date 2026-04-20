import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { Transactional } from "@application/unit-of-work/transactional.decorator";
import { UniqueId } from "@domain/@common/uniqueid";
import { ApiKey } from "@domain/application/api-key";
import { IApiKeyRepository } from "@domain/application/api-key.repository";
import IApplicationRepository from "@domain/application/application.repository";
import { IMembershipRepository } from "@domain/organization/membership.repository";
import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";

interface Input {
  applicationId: string;
  name: string;
  requesterId: string;
  expiresAt?: Date;
}

interface Output {
  id: string;
  plainKey: string;
  name: string;
  expiresAt?: Date;
}

@Injectable()
export default class GenerateApiKeyUseCase {
  constructor(
    private readonly applicationRepository: IApplicationRepository,
    private readonly membershipRepository: IMembershipRepository,
    private readonly apiKeyRepository: IApiKeyRepository,
  ) {}

  @Transactional()
  async execute(input: Input): Promise<Output> {
    const application = await this.applicationRepository.findById(UniqueId.from(input.applicationId));
    if (!application) throw new ResourceNotFoundException("Application not found");

    const membership = await this.membershipRepository.findByUserAndOrganization(UniqueId.from(input.requesterId), application.organizationId);
    if (!membership) throw new ResourceNotFoundException("You are not a member of this organization");

    const isOwnerOrAdmin = membership.props.roles?.some((r) => r.props.name === "owner" || r.props.name === "admin");
    if (!isOwnerOrAdmin) throw new ResourceNotFoundException("Insufficient permissions to generate API keys");

    const rawKey = `invault_${crypto.randomBytes(32).toString("hex")}`;
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");

    const apiKey = ApiKey.create(input.name, application.id, keyHash, input.expiresAt);
    await this.apiKeyRepository.save(apiKey);

    return {
      id: apiKey.id.toString(),
      plainKey: rawKey,
      name: apiKey.name,
      expiresAt: apiKey.expiresAt,
    };
  }
}
