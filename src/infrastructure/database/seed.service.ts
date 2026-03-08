import { Sequelize } from "sequelize";
import { logger } from "src/application/config/logger";

export default class SeedService {
  constructor(private readonly database: Sequelize) {}

  seed() {
    logger.info("Initializing Seeds");

    try {
      // Initialize methos here
      logger.info("Finish seeding");
    } catch (error) {
      logger.error("Error while seeding data: " + error);
    }
  }
}
