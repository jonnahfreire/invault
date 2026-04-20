import { ITransactionContext } from "@application/unit-of-work/transaction-context";
import { UniqueId } from "@domain/@common/uniqueid";
import { IServiceAccountRepository } from "@domain/identity/service-account.repository";
import { ServiceAccount } from "@domain/identity/service-account";
import ServiceAccountModel from "@infra/database/models/organization/service-account.model";
import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";

@Injectable()
export default class ServiceAccountRepository extends BaseRepository implements IServiceAccountRepository {
  constructor(protected readonly context: ITransactionContext) {
    super(context);
  }

  async save(entity: ServiceAccount): Promise<void> {
    await ServiceAccountModel.upsert(
      {
        id: entity.id.toString(),
        name: entity.props.name,
        applicationId: entity.props.applicationId.toString(),
        status: entity.props.status,
      },
      { transaction: this.transaction },
    );
  }

  async findById(id: UniqueId): Promise<ServiceAccount | null> {
    const row = await ServiceAccountModel.findByPk(id.toString(), { transaction: this.transaction });
    return row ? row.toDomain() : null;
  }

  async findByApplicationId(applicationId: UniqueId): Promise<ServiceAccount[]> {
    const rows = await ServiceAccountModel.findAll({ where: { applicationId: applicationId.toString() }, transaction: this.transaction });
    return rows.map((row) => row.toDomain());
  }

  async findByNameAndApplication(name: string, applicationId: UniqueId): Promise<ServiceAccount | null> {
    const row = await ServiceAccountModel.findOne({
      where: { name, applicationId: applicationId.toString() },
      transaction: this.transaction,
    });
    return row ? row.toDomain() : null;
  }
}
