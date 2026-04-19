/// <reference types="jest" />

import { AuditEvent } from "./audit-event";
import { UniqueId } from "../@common/uniqueid";

describe("AuditEvent entity", () => {
  it("should create audit event with required fields", () => {
    const actorId = UniqueId.from("actor-123");
    const resourceId = UniqueId.from("resource-123");

    const event = AuditEvent.create(actorId, "CREATE", resourceId, "current-hash");

    expect(event).toBeDefined();
    expect(event.actorId).toBe(actorId);
    expect(event.action).toBe("CREATE");
    expect(event.resourceId).toBe(resourceId);
    expect(event.currentHash).toBe("current-hash");
    expect(event.timestamp).toBeInstanceOf(Date);
  });

  it("should create audit event with optional metadata and previous hash", () => {
    const actorId = UniqueId.from("actor-123");
    const resourceId = UniqueId.from("resource-123");
    const metadata = { ip: "192.168.1.1", userAgent: "test-agent" };

    const event = AuditEvent.create(actorId, "UPDATE", resourceId, "new-hash", "old-hash", metadata);

    expect(event.previousHash).toBe("old-hash");
    expect(event.metadata).toEqual(metadata);
  });
});
