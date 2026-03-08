import { Buffer } from "buffer";
import { KekType } from "@domain/key/key-derivation";
import { Aes256Wrapper } from "@domain/encryption/aes-256-wrapper";
import { KeyManager } from "@domain/vault/key-manager";
import { Organization } from "@domain/organization/organization";
import { User } from "@domain/identity/user";
import { AuditService } from "@application/services/audit-service";
import { AuthService } from "@application/services/auth-service";
import { SecretService } from "@application/services/secret-service";
import { Permission, ResourceType, Action } from "@domain/authorization/permission";
import { Role } from "@domain/authorization/role";
import { SecretRepository } from "@infra/repositories/secret-repository";
import { SecretVersionRepository } from "@infra/repositories/secret-version-repository";

async function main() {
  // Create organization
  const organization = Organization.create("Test Organization");
  console.log("Organization created:", {
    id: organization.id.toString(),
    name: organization.props.name,
  });

  // Create user
  const user = User.create("testuser", "test@example.com", organization.id);
  console.log("User created:", {
    id: user.id.toString(),
    username: user.props.username,
    email: user.props.email,
  });

  // Create role with permissions
  const role = Role.create("Admin", organization.id);
  const readPermission = Permission.create(ResourceType.SECRET, Action.READ);
  const writePermission = Permission.create(ResourceType.SECRET, Action.WRITE);
  role.addPermission(readPermission);
  role.addPermission(writePermission);
  console.log("Role created:", {
    id: role.id.toString(),
    name: role.props.name,
    permissions: role.permissions.map((p) => `${p.props.resource}:${p.props.action}`),
  });

  // Initialize repositories
  const secretRepo = new SecretRepository();
  const versionRepo = new SecretVersionRepository();
  const auditService = new AuditService();
  const authService = new AuthService();

  // Register user
  authService.registerUser(user, "password123");
  authService.assignRoleToUser(user.id, role);

  console.log("User registered and role assigned");

  // Authenticate
  const authenticatedUser = authService.authenticate("testuser", "password123");
  if (!authenticatedUser) {
    throw new Error("Authentication failed");
  }
  console.log("User authenticated:", authenticatedUser.props.username);

  // Check permissions
  const canReadSecret = authService.authorize(authenticatedUser.id, ResourceType.SECRET, Action.READ);
  const canWriteSecret = authService.authorize(authenticatedUser.id, ResourceType.SECRET, Action.WRITE);
  console.log("Can read secret:", canReadSecret);
  console.log("Can write secret:", canWriteSecret);

  // Master key for encryption (in production, this should be securely managed)
  const masterKey = "my-secret-master-key";

  // Create secret service
  const secretService = new SecretService(secretRepo, versionRepo, auditService, masterKey);

  // Create a secret
  const secret = await secretService.createSecret("database-password", "kv", organization.id, role.id, "kv", { username: "dbuser", password: "secret123" }, user.id);
  console.log("Secret created:", {
    id: secret.id.toString(),
    name: secret.props.name,
    type: secret.props.type,
  });

  // Retrieve secret data
  const data = await secretService.getSecretData(secret.id, user.id);
  console.log("Secret data retrieved:", data);

  // Add another version
  await secretService.addSecretVersion(secret.id, { username: "dbuser", password: "newsecret456" }, user.id);
  console.log("New version added");

  // Retrieve latest data
  const latestData = await secretService.getSecretData(secret.id, user.id);
  console.log("Latest secret data:", latestData);

  // Show audit events
  console.log("Audit Events:");
  auditService.getEvents().forEach((event) => {
    console.log(`- ${event.props.action} at ${event.props.timestamp.toISOString()}`);
  });
}

// main().catch(console.error);

// async function shamirTest() {
//   try {
//     const shareCount = 5;
//     const threshold = 3;
//     const encryptionKey = randomUUID();

//     const shamir = new ShamirSecretSharing(threshold, shareCount);
//     const shares = await shamir.create(encryptionKey);
//     console.log("Shares created:", shamir.shareToString(shares));

//     const sharesToCombine = shamir.shareToString(shares).slice(0, threshold);
//     console.log("Shares To Combine: ", sharesToCombine);

//     const reconstructed = await shamir.reconstruct(sharesToCombine);
//     console.log("Reconstructed:", reconstructed);
//     console.log("Success:", reconstructed === encryptionKey);
//   } catch (error) {
//     console.error("An error occurred:", error);
//   }
// }

async function encryptionTest() {
  const threshold = 3;
  const keyManager = new KeyManager(threshold);
  keyManager.addShare("4aeaf76d7276def865dc46c4c892d8f20fdc941d9a6ed0aa3fc3dbd34fe1d9e2bcaffc5b6f");
  keyManager.addShare("c630a53185afc7429d9ef6371e949af37aa40573769002423c28ad520aca84cc91a24b0b61");
  keyManager.addShare("e578dd81e158f6379faedcb0a851b326bec9d5c641edda803aa66d360ddd85e375dab3ba46");

  const kekV1 = await keyManager.deriveKEK({ salt: "salt-kek", keytype: KekType.DATABASE, env: "dev", keyVersion: 1 });
  const dek = keyManager.generateRandomDEK();

  const data = Aes256Wrapper.wrap({
    cipher: JSON.stringify({
      db: {
        host: "127.0.0.1",
        name: "db-test",
        password: "@#$asd!@#2",
      },
    }),
    kek: kekV1,
    dek: dek,
  });
  // console.log("Encrypted Data: ", data);

  const decryptedData = Aes256Wrapper.unwrap({
    data: data.cipherData,
    dek: {
      ...data.cipherDek,
      key: Buffer.from(kekV1).toString("hex"),
    },
  });
  console.log("Decrypted data: ", JSON.parse(decryptedData));
}

// runShamir();
encryptionTest().catch(console.log);
