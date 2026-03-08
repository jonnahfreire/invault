import { DatabaseConnection } from "@application/database/database-connection";
import { IMessagingClient } from "@application/messaging/messaging-client";
import ICepService from "@application/services/cep.service";
import MiraCepService from "@application/services/mira-cep.service";
import MiraFiscalService from "@application/services/mira-fiscal.service";
import MiraSequenceService from "@application/services/mira-sequence.service";
import { ISequenceService } from "@application/services/sequence.service";
import { TransactionalContext } from "@application/unit-of-work/abstract/transaction-context";
import IUnitOfWork from "@application/unit-of-work/abstract/unit-of-work";
import SequelizeTransactionalContext from "@application/unit-of-work/sequelize-transactional.context";
import UnitOfWork from "@application/unit-of-work/uow";
import SequelizeConnection from "@infra/database/sequelize.connection";
import AuthorizationService from "@infra/http/vault/auth/services/authorization.service";
import { RabbitMQClient } from "@infra/messaging/rabbitmq-client";

export const SERVICE_PROVIDERS = [
  AuthorizationService,
  { provide: IUnitOfWork, useClass: UnitOfWork },
  { provide: ICepService, useClass: MiraCepService },
  { provide: MiraFiscalService, useClass: MiraFiscalService },
  { provide: DatabaseConnection, useClass: SequelizeConnection },
  { provide: TransactionalContext, useClass: SequelizeTransactionalContext },
  { provide: ISequenceService, useClass: MiraSequenceService },
  { provide: IMessagingClient, useClass: RabbitMQClient },
];
