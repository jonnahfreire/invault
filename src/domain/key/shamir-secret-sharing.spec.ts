/// <reference types="jest" />

import { ShamirSecretSharing } from "./shamir-secret-sharing";

describe("ShamirSecretSharing utility", () => {
  it("should split and reconstruct secret correctly", async () => {
    const secret = "my-secret-password";
    const threshold = 3;
    const shareCount = 5;

    const shares = await ShamirSecretSharing.create(secret, threshold, shareCount);

    expect(shares).toHaveLength(shareCount);

    // Test reconstruction with minimum threshold
    const reconstructed = await ShamirSecretSharing.reconstruct([Buffer.from(shares[0]), Buffer.from(shares[1]), Buffer.from(shares[2])]);

    expect(reconstructed).toBe(secret);
  });

  it("should throw error for empty secret", async () => {
    await expect(ShamirSecretSharing.create("", 3, 5)).rejects.toThrow("Secret must not be null or empty");
  });

  it("should throw error for zero share count", async () => {
    await expect(ShamirSecretSharing.create("secret", 3, 0)).rejects.toThrow("ShareCount must not be null or zero");
  });

  it("should throw error for zero threshold", async () => {
    await expect(ShamirSecretSharing.create("secret", 0, 5)).rejects.toThrow("Threshold must not be null or zero");
  });

  it("should throw error when reconstructing with no shares", async () => {
    await expect(ShamirSecretSharing.reconstruct([])).rejects.toThrow("Shares are required");
  });

  it("should convert shares to string format", () => {
    const sss = new ShamirSecretSharing();
    const mockShares = [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])];

    const stringShares = sss.shareToString(mockShares);

    expect(stringShares).toHaveLength(2);
    expect(typeof stringShares[0]).toBe("string");
    expect(stringShares[0]).toBe("010203");
    expect(stringShares[1]).toBe("040506");
  });
});
