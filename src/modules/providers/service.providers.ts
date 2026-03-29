import { DatabaseConnection } from "@application/database/database-connection";
import { AuditService } from "@application/services/audit.service";
import { KeyManagerService } from "@application/services/key-manager.service";
import { TransactionalContext } from "@application/unit-of-work/abstract/transaction-context";
import IUnitOfWork from "@application/unit-of-work/abstract/unit-of-work";
import SequelizeTransactionalContext from "@application/unit-of-work/sequelize-transactional.context";
import UnitOfWork from "@application/unit-of-work/uow";
import SequelizeConnection from "@infra/database/sequelize.connection";
import AuthorizationService from "@infra/http/vault/auth/services/authorization.service";

export const SERVICE_PROVIDERS = [
  AuthorizationService,
  KeyManagerService,
  AuditService,
  { provide: IUnitOfWork, useClass: UnitOfWork },
  { provide: DatabaseConnection, useClass: SequelizeConnection },
  { provide: TransactionalContext, useClass: SequelizeTransactionalContext },
];
