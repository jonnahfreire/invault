/// <reference types="jest" />

import RevokeApiKeyUseCase from "./revoke-api-key.usecase";
import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import IllegalArgumentException from "@application/exceptions/illegal-argument.exception";
import { UniqueId } from "@domain/@common/uniqueid";
import { ApiKey } from "@domain/application/api-key";

describe("RevokeApiKeyUseCase", () => {
  const applicationRepository = {
    findById: jest.fn(),
  } as any;

  const membershipRepository = {
    findByUserAndOrganization: jest.fn(),
  } as any;

  const apiKeyRepository = {
    findById: jest.fn(),
    save: jest.fn(),
  } as any;

  const auditService = {
    logEvent: jest.fn(),
  } as any;

  const useCase = new RevokeApiKeyUseCase(applicationRepository, membershipRepository, apiKeyRepository, auditService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("revokes an active API key and writes audit event", async () => {
    const organizationId = UniqueId.create();
    const applicationId = UniqueId.create();
    const requesterId = UniqueId.create().toString();
    const apiKey = ApiKey.create("prod", applicationId, "hash");

    applicationRepository.findById.mockResolvedValue({ id: applicationId, organizationId });
    membershipRepository.findByUserAndOrganization.mockResolvedValue({
      props: {
        roles: [{ props: { name: "owner" } }],
      },
    });
    apiKeyRepository.findById.mockResolvedValue(apiKey);

    await useCase.execute({
      applicationId: applicationId.toString(),
      apiKeyId: apiKey.id.toString(),
      requesterId,
    });

    expect(apiKey.active).toBe(false);
    expect(apiKeyRepository.save).toHaveBeenCalledWith(apiKey);
    expect(auditService.logEvent).toHaveBeenCalledTimes(1);
  });

  it("throws when requester has no organization membership", async () => {
    const organizationId = UniqueId.create();
    const applicationId = UniqueId.create();

    applicationRepository.findById.mockResolvedValue({ id: applicationId, organizationId });
    membershipRepository.findByUserAndOrganization.mockResolvedValue(null);

    await expect(
      useCase.execute({
        applicationId: applicationId.toString(),
        apiKeyId: UniqueId.create().toString(),
        requesterId: UniqueId.create().toString(),
      }),
    ).rejects.toThrow(ResourceNotFoundException);
  });

  it("throws when API key belongs to another application", async () => {
    const organizationId = UniqueId.create();
    const applicationId = UniqueId.create();
    const anotherApplicationId = UniqueId.create();
    const apiKey = ApiKey.create("prod", anotherApplicationId, "hash");

    applicationRepository.findById.mockResolvedValue({ id: applicationId, organizationId });
    membershipRepository.findByUserAndOrganization.mockResolvedValue({
      props: {
        roles: [{ props: { name: "admin" } }],
      },
    });
    apiKeyRepository.findById.mockResolvedValue(apiKey);

    await expect(
      useCase.execute({
        applicationId: applicationId.toString(),
        apiKeyId: apiKey.id.toString(),
        requesterId: UniqueId.create().toString(),
      }),
    ).rejects.toThrow(IllegalArgumentException);
  });

  it("does not persist when API key is already revoked", async () => {
    const organizationId = UniqueId.create();
    const applicationId = UniqueId.create();
    const apiKey = ApiKey.create("prod", applicationId, "hash");
    apiKey.revoke();

    applicationRepository.findById.mockResolvedValue({ id: applicationId, organizationId });
    membershipRepository.findByUserAndOrganization.mockResolvedValue({
      props: {
        roles: [{ props: { name: "owner" } }],
      },
    });
    apiKeyRepository.findById.mockResolvedValue(apiKey);

    await useCase.execute({
      applicationId: applicationId.toString(),
      apiKeyId: apiKey.id.toString(),
      requesterId: UniqueId.create().toString(),
    });

    expect(apiKeyRepository.save).not.toHaveBeenCalled();
    expect(auditService.logEvent).not.toHaveBeenCalled();
  });
});
