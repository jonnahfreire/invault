import { UniqueId } from "@domain/@common/uniqueid";
import { Application } from "@domain/application/application";
import IApplicationRepository from "@domain/application/application.repository";
import ApplicationModel from "@infra/database/models/organization/application.model";
import ServiceAccountModel from "@infra/database/models/organization/service-account.model";
import { ITransactionContext } from "@application/unit-of-work/transaction-context";
import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";

@Injectable()
export default class ApplicationRepository extends BaseRepository implements IApplicationRepository {
  constructor(protected readonly context: ITransactionContext) {
    super(context);
  }

  async save(entity: Application): Promise<void> {
    await ApplicationModel.upsert(
      {
        id: entity.id.toString(),
        name: entity.props.name,
        organizationId: entity.organizationId.toString(),
      },
      { transaction: this.transaction },
    );
  }

  async findById(id: UniqueId): Promise<Application | null> {
    const row = await ApplicationModel.findByPk(id.toString(), {
      include: [{ model: ServiceAccountModel, as: "serviceAccounts" }],
      transaction: this.transaction,
    });
    return row ? row.toDomain() : null;
  }

  async findAllByOrganizationId(organizationId: UniqueId): Promise<Application[]> {
    const rows = await ApplicationModel.findAll({
      where: { organizationId: organizationId.toString() },
      include: [{ model: ServiceAccountModel, as: "serviceAccounts" }],
      transaction: this.transaction,
    });
    return rows.map((r) => r.toDomain());
  }

  async delete(id: UniqueId): Promise<void> {
    await ApplicationModel.destroy({ where: { id: id.toString() }, transaction: this.transaction });
  }
}
