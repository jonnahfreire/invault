/// <reference types="jest" />

import { Organization } from "./organization";
import { OrganizationStatus } from "./enum/organization-status.enum";

describe("Organization entity", () => {
  it("should create organization as active", () => {
    const org = Organization.create("MyOrg");

    expect(org).toBeDefined();
    expect(org.props.name).toBe("MyOrg");
    expect(org.props.status).toBe(OrganizationStatus.ACTIVE);
    expect(org.props.applications).toEqual([]);
    expect(org.props.users).toEqual([]);
  });

  it("should throw when organization name is invalid", () => {
    expect(() => Organization.create("")).toThrow(/Organization name must not be null or empty/);
    expect(() => Organization.create(null as any)).toThrow();
  });

  it("should change status by methods", () => {
    const org = Organization.create("OrgStatus");

    org.suspend();
    expect(org.props.status).toBe(OrganizationStatus.SUSPENDED);

    org.archive();
    expect(org.props.status).toBe(OrganizationStatus.ARCHIVED);

    org.activate();
    expect(org.props.status).toBe(OrganizationStatus.ACTIVE);
  });
});
