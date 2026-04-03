import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./",
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.spec.json",
        diagnostics: true,
      },
    ],
  },
  collectCoverageFrom: ["src/**/*.{ts,js}"],
  coverageDirectory: "coverage",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleNameMapper: {
    "^@application/(.*)$": "<rootDir>/src/application/$1",
    "^@domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@infra/(.*)$": "<rootDir>/src/infrastructure/$1",
    "^@usecases/(.*)$": "<rootDir>/src/application/usecases/$1",
    "^@repositories/(.*)$": "<rootDir>/src/infrastructure/repositories/$1",
  },
};

export default config;
