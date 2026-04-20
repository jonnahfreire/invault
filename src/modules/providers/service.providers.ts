import { IDatabaseConnection } from "@application/database/database-connection";
import { AuditService } from "@application/services/audit.service";
import { KeyManagerService } from "@application/services/key-manager.service";
import { ITransactionContext } from "@application/unit-of-work/transaction-context";
import IUnitOfWork from "@application/unit-of-work/unit-of-work";
import TransactionContext from "@infra/database/transaction/transactional.context";
import UnitOfWork from "@infra/database/transaction/unit-of-work";
import SequelizeConnection from "@infra/database/sequelize.connection";
import AuthorizationService from "@application/services/authorization.service";
import { SecretAuthorizationService } from "@application/services/secret-authorization.service";
import TransactionExecutor from "../../infrastructure/database/transaction/transaction-executor";
import TransactionalBootstrapService from "../../infrastructure/database/transaction/transactional-bootstrap.service";

export const SERVICE_PROVIDERS = [
  AuthorizationService,
  SecretAuthorizationService,
  KeyManagerService,
  AuditService,
  TransactionExecutor,
  TransactionalBootstrapService,
  { provide: IUnitOfWork, useClass: UnitOfWork },
  { provide: IDatabaseConnection, useClass: SequelizeConnection },
  { provide: ITransactionContext, useClass: TransactionContext },
];
