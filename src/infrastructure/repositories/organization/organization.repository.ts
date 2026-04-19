import { UniqueId } from "@domain/@common/uniqueid";
import { Application } from "@domain/application/application";
import { Organization } from "@domain/organization/organization";
import { IOrganizationRepository } from "@domain/organization/organization.repository";
import ApplicationModel from "@infra/database/models/organization/application.model";
import OrganizationModel from "@infra/database/models/organization/organization.model";
import UserModel from "@infra/database/models/organization/user.model";
import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";
import { ITransactionContext } from "@application/unit-of-work/transaction-context";

@Injectable()
export default class OrganizationRepository extends BaseRepository implements IOrganizationRepository {
  constructor(protected readonly context: ITransactionContext) {
    super(context);
  }

  async save(entity: Organization): Promise<void> {
    await OrganizationModel.upsert(
      {
        id: entity.id.toString(),
        name: entity.name,
        status: entity.status,
      },
      { transaction: this.transaction },
    );
  }

  async findById(id: UniqueId): Promise<Organization | null> {
    const organization = await OrganizationModel.findByPk(id.toString(), { transaction: this.transaction });
    return organization ? organization.toDomain() : null;
  }

  async findAll(): Promise<Organization[]> {
    const organizations = await OrganizationModel.findAll({
      include: [
        { model: ApplicationModel, as: "applications" },
        { model: UserModel, as: "users" },
      ],
      transaction: this.transaction,
    });
    return organizations.map((organization) => organization.toDomain());
  }

  async delete(id: UniqueId): Promise<void> {
    await OrganizationModel.destroy({ where: { id: id.toString() }, transaction: this.transaction });
  }

  async findByName(name: string): Promise<Organization | null> {
    const organization = await OrganizationModel.findOne({ where: { name }, transaction: this.transaction });
    return organization ? organization.toDomain() : null;
  }

  async findApplicationById(id: UniqueId): Promise<Application | null> {
    const application = await ApplicationModel.findByPk(id.toString(), { transaction: this.transaction });
    return application ? application.toDomain() : null;
  }
}
