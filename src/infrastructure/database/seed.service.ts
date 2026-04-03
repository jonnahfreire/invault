import { Sequelize } from "sequelize";
import { logger } from "src/application/config/logger";
import { UniqueId } from "@domain/@common/uniqueid";
import { Action, Permission } from "@domain/organization/permission";
import SystemModel from "./models/system/system.model";
import { Role } from "@domain/organization/role";

export default class SeedService {
  constructor(private readonly database: Sequelize) {}

  async seed() {
    logger.info("Initializing Seeds");
    await this.initializeSystem();

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

    const organizationOwnerPermissions = [
      Permission.create({ action: Action.READ, resource: "organization" }),
      Permission.create({ action: Action.CREATE, resource: "organization" }),
      Permission.create({ action: Action.UPDATE, resource: "organization" }),
      Permission.create({ action: Action.DELETE, resource: "organization" }),
    ];
    // TODO: Save organization owner role to database
    Role.create({ name: "owner", permissions: organizationOwnerPermissions });
  }
}
