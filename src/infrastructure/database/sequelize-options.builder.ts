import { Options } from "sequelize";

type SequelizeConnectionSettings = {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  logging?: boolean;
};

export function buildSequelizeOptions(settings: SequelizeConnectionSettings): Options {
  return {
    dialect: "postgres",
    host: settings.host,
    port: settings.port,
    database: settings.database,
    username: settings.username,
    password: settings.password,
    logging: settings.logging ?? false,
    timezone: "America/Sao_Paulo",
  };
}
