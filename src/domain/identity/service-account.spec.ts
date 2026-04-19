/// <reference types="jest" />

import { ServiceAccount } from "./service-account";
import { ServiceAccountStatus } from "./enum/service-account-status.enum";
import { UniqueId } from "../@common/uniqueid";

describe("ServiceAccount entity", () => {
  it("should create service account as active", () => {
    const applicationId = UniqueId.from("app-123");

    const serviceAccount = ServiceAccount.create("test-service", applicationId);

    expect(serviceAccount).toBeDefined();
    expect(serviceAccount.props.name).toBe("test-service");
    expect(serviceAccount.props.applicationId).toBe(applicationId);
    expect(serviceAccount.props.status).toBe(ServiceAccountStatus.ACTIVE);
    expect(serviceAccount.props.createdAt).toBeInstanceOf(Date);
    expect(serviceAccount.isActive()).toBe(true);
    expect(serviceAccount.isRevoked()).toBe(false);
  });

  it("should revoke service account", () => {
    const applicationId = UniqueId.from("app-123");
    const serviceAccount = ServiceAccount.create("test-service", applicationId);

    expect(serviceAccount.isActive()).toBe(true);

    serviceAccount.revoke();

    expect(serviceAccount.props.status).toBe(ServiceAccountStatus.REVOKED);
    expect(serviceAccount.isRevoked()).toBe(true);
    expect(serviceAccount.isActive()).toBe(false);
  });
});
