/// <reference types="jest" />

import IllegalAccessException from "@application/exceptions/illegal-access.exception";
import ResourceNotFoundException from "@application/exceptions/resource-not-found.exception";
import { UniqueId } from "@domain/@common/uniqueid";
import ListApplicationSecretsByApiKeyUseCase from "./list-application-secrets-by-api-key.usecase";

describe("ListApplicationSecretsByApiKeyUseCase", () => {
  const applicationRepository = {
    findById: jest.fn(),
  } as any;

  const secretRepository = {
    findAllByOwnerId: jest.fn(),
  } as any;

  const useCase = new ListApplicationSecretsByApiKeyUseCase(applicationRepository, secretRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("throws when API key applicationId differs from requested applicationId", async () => {
    await expect(
      useCase.execute({
        applicationId: UniqueId.create().toString(),
        authenticatedApplicationId: UniqueId.create().toString(),
      }),
    ).rejects.toThrow(IllegalAccessException);
  });

  it("throws when application does not exist", async () => {
    const applicationId = UniqueId.create().toString();
    applicationRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        applicationId,
        authenticatedApplicationId: applicationId,
      }),
    ).rejects.toThrow(ResourceNotFoundException);
  });

  it("returns application secrets metadata", async () => {
    const applicationId = UniqueId.create();

    applicationRepository.findById.mockResolvedValue({ id: applicationId });
    secretRepository.findAllByOwnerId.mockResolvedValue([
      {
        id: UniqueId.create(),
        name: "DB_PASS",
        type: "DATABASE",
        status: "active",
        currentVersionId: UniqueId.create(),
        createdAt: new Date("2026-04-19T00:00:00.000Z"),
      },
    ]);

    const output = await useCase.execute({
      applicationId: applicationId.toString(),
      authenticatedApplicationId: applicationId.toString(),
    });

    expect(output).toHaveLength(1);
    expect(output[0]).toEqual(
      expect.objectContaining({
        name: "DB_PASS",
        type: "DATABASE",
      }),
    );
  });
});
