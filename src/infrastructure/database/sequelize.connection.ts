import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConnectionQueryParams, IDatabaseConnection } from "../../application/database/database-connection";
import { Sequelize } from "sequelize-typescript";
import { Environment } from "src/application/config/environment";
import { DATE, QueryTypes, Transaction } from "sequelize";
import { logger } from "../../application/config/logger";
import SeedService from "./seed.service";

@Injectable()
export default class SequelizeConnection extends IDatabaseConnection implements OnModuleInit, OnModuleDestroy {
  private sequelize!: Sequelize;

  constructor(private readonly environment: Environment) {
    super();
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.sequelize.close();
  }

  async connect(): Promise<void> {
    try {
      DATE.prototype._stringify = function _stringify(date: any, options: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        date = this._applyTimezone(date, options);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return date.format("YYYY-MM-DD HH:mm:ss.SSS");
      };

      this.sequelize = new Sequelize({
        dialect: "postgres", // postgres | mysql | mariadb | sqlite
        host: String(this.environment.database.host),
        port: Number(this.environment.database.port),
        database: String(this.environment.database.name),
        username: String(this.environment.database.user),
        password: String(this.environment.database.password),
        logging: false,
        timezone: "America/Sao_Paulo", // Set timezone to Brasilia time
      });

      this.sequelize.addModels([__dirname + "/models/**/*.model.{ts,js}"]);
      await this.sequelize.authenticate();
      await this.sequelize.sync({ alter: true });

      logger.info("---------------------------------------------------");
      logger.info("Database connection established successfully");
      if (this.environment.isDevelopment) {
        logger.info("Database connection details:");
        logger.info(`Host: ${this.environment.database.host}`);
        logger.info(`Port: ${this.environment.database.port}`);
        logger.info(`Database: ${this.environment.database.name}`);
        logger.info("Added Models: " + Object.keys(this.sequelize.models).join(", ") + "\n");
      }

      const seeder = new SeedService(this.sequelize);
      await seeder.seed();
    } catch (error) {
      logger.error("Failed to connect to the database:", error);
      throw error;
    }
  }

  async query(sql: string, params: ConnectionQueryParams = [], transaction?: Transaction): Promise<any> {
    return this.sequelize.query<any>(sql, {
      replacements: params,
      type: QueryTypes.SELECT,
      transaction,
    });
  }

  async transaction<T>(callback: (transaction: Transaction) => Promise<T>): Promise<T> {
    return this.sequelize.transaction(async (transaction) => {
      return callback(transaction);
    });
  }

  async createTransaction<T>(): Promise<T> {
    return (await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    })) as T;
  }

  async callProcedure(procedureName: string, params: Record<string, any>, transaction?: Transaction): Promise<any> {
    const keys = Object.keys(params);

    const placeholders = keys.map((key) => `@${key} = :${key}`).join(", ");

    const sql = `EXEC ${procedureName} ${placeholders}`;

    return this.sequelize.query(sql, {
      replacements: params,
      type: QueryTypes.RAW,
      transaction,
    });
  }
}
