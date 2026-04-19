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
    dialect: "mssql",
    host: settings.host,
    port: settings.port,
    database: settings.database,
    username: settings.username,
    password: settings.password,
    logging: settings.logging ?? false,
    timezone: "America/Sao_Paulo",
    dialectOptions: {
      trustServerCertificate: true,
      options: {
        encrypt: true,
        useUTC: false,
        connectTimeout: 60000,
        requestTimeout: 300000,
      },
    },
  };
}
