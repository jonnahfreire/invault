/// <reference types="jest" />

import { ShareVault } from "./share-vault";

describe("ShareVault entity", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should create share vault with threshold", () => {
    const vault = new ShareVault(3);

    expect(vault).toBeDefined();
    expect(vault.isReady()).toBe(false);
  });

  it("should add unique shares and become ready when threshold reached", () => {
    const vault = new ShareVault(2);

    const share1 = Buffer.from("share1");
    const share2 = Buffer.from("share2");

    vault.addShare(share1);
    expect(vault.isReady()).toBe(false);

    vault.addShare(share2);
    expect(vault.isReady()).toBe(true);
  });

  it("should reject duplicate shares", () => {
    const vault = new ShareVault(2);
    const share = Buffer.from("duplicate-share");

    vault.addShare(share);

    expect(() => vault.addShare(share)).toThrow("Shares must be unique");
  });

  it("should not add shares beyond threshold", () => {
    const vault = new ShareVault(2);

    vault.addShare(Buffer.from("share1"));
    vault.addShare(Buffer.from("share2"));
    vault.addShare(Buffer.from("share3")); // Should be ignored

    expect(vault.isReady()).toBe(true);
  });

  it("should throw when getting shares before ready", () => {
    const vault = new ShareVault(2);

    vault.addShare(Buffer.from("share1"));

    expect(() => vault.getShares()).toThrow("Vault is sealed.");
  });

  it("should return shares when ready", () => {
    const vault = new ShareVault(2);
    const share1 = Buffer.from("share1");
    const share2 = Buffer.from("share2");

    vault.addShare(share1);
    vault.addShare(share2);

    const shares = vault.getShares();
    expect(shares).toHaveLength(2);
    expect(shares[0]).toEqual(share1);
    expect(shares[1]).toEqual(share2);
  });

  it("should destroy shares when preserveShares is false", () => {
    const vault = new ShareVault(2, false, 1000); // preserveShares = false

    vault.addShare(Buffer.from("share1"));
    vault.addShare(Buffer.from("share2"));

    // Fast-forward time to trigger destroy
    jest.advanceTimersByTime(1000);

    // Since destroy is called in timeout, shares should be cleared
    // Note: This test assumes destroy() clears shares when preserveShares=false
    expect(vault.isReady()).toBe(false);
  });

  it("should expose sealed status, threshold and loaded shares", () => {
    const vault = new ShareVault(2);

    expect(vault.getStatus()).toEqual({
      sealed: true,
      sharesLoaded: 0,
      threshold: 2,
    });

    vault.addShare(Buffer.from("share1"));
    expect(vault.getStatus()).toEqual({
      sealed: true,
      sharesLoaded: 1,
      threshold: 2,
    });

    vault.addShare(Buffer.from("share2"));
    expect(vault.getStatus()).toEqual({
      sealed: false,
      sharesLoaded: 2,
      threshold: 2,
    });
  });

  it("should reseal vault and clear shares", () => {
    const vault = new ShareVault(2);

    vault.addShare(Buffer.from("share1"));
    vault.addShare(Buffer.from("share2"));
    expect(vault.isReady()).toBe(true);

    vault.reseal();

    expect(vault.isReady()).toBe(false);
    expect(vault.getStatus()).toEqual({
      sealed: true,
      sharesLoaded: 0,
      threshold: 2,
    });
  });
});
