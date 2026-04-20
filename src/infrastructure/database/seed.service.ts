import { Sequelize } from "sequelize";
import { logger } from "src/application/config/logger";
import { UniqueId } from "@domain/@common/uniqueid";
import SystemModel from "./models/system/system.model";
import PermissionModel from "./models/organization/permission.model";
import RoleModel from "./models/organization/role.model";
import RolePermissionModel from "./models/organization/role-permission.model";

type PermissionSeed = {
  resource: string;
  action: string;
};

type RoleSeed = {
  name: string;
  permissions: string[];
};

export default class SeedService {
  constructor(private readonly database: Sequelize) {}

  async seed() {
    logger.info("Initializing Seeds");
    await this.initializeSystem();
    await this.initializePermissionsAndRoles();

    try {
      logger.info("Finish seeding");
    } catch (error) {
      logger.error("Error while seeding data: " + error);
    }
  }

  async initializeSystem() {
    const systemName = process.env.SYSTEM_NAME || "invault";
    const system = await SystemModel.findOne({ where: { name: systemName } });

    if (!system) {
      await SystemModel.create({
        id: UniqueId.create().toString(),
        name: systemName,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  private async initializePermissionsAndRoles(): Promise<void> {
    const permissionSeeds: PermissionSeed[] = [
      { resource: "organization", action: "read" },
      { resource: "organization", action: "create" },
      { resource: "organization", action: "update" },
      { resource: "organization", action: "delete" },
      { resource: "application", action: "read" },
      { resource: "application", action: "create" },
      { resource: "application", action: "update" },
      { resource: "application", action: "delete" },
      { resource: "secret", action: "read" },
      { resource: "secret", action: "create" },
      { resource: "secret", action: "update" },
      { resource: "secret", action: "delete" },
      { resource: "secret", action: "rotate" },
      { resource: "user", action: "read" },
      { resource: "user", action: "update" },
      { resource: "role", action: "read" },
      { resource: "role", action: "grant" },
      { resource: "system", action: "read" },
    ];

    const roleSeeds: RoleSeed[] = [
      {
        name: "owner",
        permissions: permissionSeeds.map((p) => this.permissionKey(p.resource, p.action)),
      },
      {
        name: "admin",
        permissions: [
          this.permissionKey("organization", "read"),
          this.permissionKey("organization", "update"),
          this.permissionKey("application", "read"),
          this.permissionKey("application", "create"),
          this.permissionKey("application", "update"),
          this.permissionKey("application", "delete"),
          this.permissionKey("secret", "read"),
          this.permissionKey("secret", "create"),
          this.permissionKey("secret", "update"),
          this.permissionKey("secret", "delete"),
          this.permissionKey("secret", "rotate"),
          this.permissionKey("user", "read"),
          this.permissionKey("role", "read"),
          this.permissionKey("role", "grant"),
          this.permissionKey("system", "read"),
        ],
      },
      {
        name: "member",
        permissions: [
          this.permissionKey("organization", "read"),
          this.permissionKey("application", "read"),
          this.permissionKey("secret", "read"),
          this.permissionKey("secret", "create"),
          this.permissionKey("secret", "update"),
          this.permissionKey("secret", "rotate"),
          this.permissionKey("user", "read"),
        ],
      },
      {
        name: "auditor",
        permissions: [
          this.permissionKey("organization", "read"),
          this.permissionKey("application", "read"),
          this.permissionKey("secret", "read"),
          this.permissionKey("user", "read"),
          this.permissionKey("system", "read"),
        ],
      },
    ];

    const permissionMap = await this.seedPermissions(permissionSeeds);
    await this.seedRoles(roleSeeds, permissionMap);
  }

  private async seedPermissions(permissionSeeds: PermissionSeed[]): Promise<Map<string, PermissionModel>> {
    const map = new Map<string, PermissionModel>();

    for (const seed of permissionSeeds) {
      const existing = await PermissionModel.findOne({
        where: { resource: seed.resource, action: seed.action },
        paranoid: false,
      });

      let permission: PermissionModel;
      if (!existing) {
        permission = await PermissionModel.create({
          id: UniqueId.create().toString(),
          resource: seed.resource,
          action: seed.action,
          createdAt: new Date(),
        });
      } else {
        permission = existing;
        if ((permission as any).deletedAt) {
          await permission.restore();
        }
      }

      map.set(this.permissionKey(seed.resource, seed.action), permission);
    }

    return map;
  }

  private async seedRoles(roleSeeds: RoleSeed[], permissionMap: Map<string, PermissionModel>): Promise<void> {
    for (const seed of roleSeeds) {
      const existing = await RoleModel.findOne({
        where: { name: seed.name, organizationId: null },
        paranoid: false,
      });

      let role: RoleModel;
      if (!existing) {
        role = await RoleModel.create({
          id: UniqueId.create().toString(),
          name: seed.name,
          organizationId: null,
          parentRoleId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        role = existing;
        if ((role as any).deletedAt) {
          await role.restore();
        }
      }

      for (const permissionKey of seed.permissions) {
        const permission = permissionMap.get(permissionKey);
        if (!permission) continue;

        const link = await RolePermissionModel.findOne({
          where: {
            roleId: role.id,
            permissionId: permission.id,
          },
          paranoid: false,
        });

        if (!link) {
          await RolePermissionModel.create({
            roleId: role.id,
            permissionId: permission.id,
          });
        } else if ((link as any).deletedAt) {
          await link.restore();
        }
      }
    }
  }

  private permissionKey(resource: string, action: string): string {
    return `${resource}:${action}`;
  }
}
