import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { ConnectionQueryParams, IDatabaseConnection } from "@application/database/database-connection";
import { buildSequelizeOptions } from "./sequelize-options.builder";
import { Sequelize } from "sequelize-typescript";
import { QueryTypes, Transaction } from "sequelize";
import { ensureSequelizeDateStringifyPatch } from "./sequelize-date.patch";
import { Environment } from "@application/config/environment";
import SeedService from "./seed.service";

@Injectable()
export default class SequelizeConnection implements IDatabaseConnection, OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SequelizeConnection.name);
  private sequelize!: Sequelize;

  constructor(private readonly environment: Environment) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.sequelize.close();
  }

  async connect(): Promise<void> {
    try {
      ensureSequelizeDateStringifyPatch();

      this.sequelize = new Sequelize(
        buildSequelizeOptions({
          host: String(this.environment.database.host),
          port: Number(this.environment.database.port),
          database: String(this.environment.database.name),
          username: String(this.environment.database.user),
          password: String(this.environment.database.password),
          logging: false,
        }),
      );

      this.sequelize.addModels([__dirname + "/models/**/*.model.{ts,js}"]);
      await this.sequelize.authenticate({
        logging: (msg) => this.logger.debug(msg),
        benchmark: true,
      });

      await this.sequelize.sync({ alter: true });
      await new SeedService(this.sequelize).seed();

      this.logger.log(`Database ${this.environment.database.name} connected`);
    } catch (error) {
      if (error instanceof Error) this.logger.error(`Failed to connect to the database: ${error.message}`, error.stack);
      else this.logger.error(`Failed to connect to the database: ${String(error)}`);
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
