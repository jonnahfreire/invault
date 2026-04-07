import { UniqueId } from "@domain/@common/uniqueid";
import { Application } from "@domain/application/application";
import { Organization } from "@domain/organization/organization";
import { IOrganizationRepository } from "@domain/organization/organization.repository";
import ApplicationModel from "@infra/database/models/organization/application.model";
import OrganizationModel from "@infra/database/models/organization/organization.model";
import UserModel from "@infra/database/models/organization/user.model";

export default class OrganizationRepository implements IOrganizationRepository {
  async save(entity: Organization, transaction?: any): Promise<void> {
    await OrganizationModel.upsert(
      {
        id: entity.id.toString(),
        name: entity.name,
        status: entity.status,
      },
      { transaction },
    );
  }

  async findById(id: UniqueId, transaction?: any): Promise<Organization | null> {
    const organization = await OrganizationModel.findByPk(id.toString(), { transaction });
    return organization ? organization.toDomain() : null;
  }

  async findAll(transaction?: any): Promise<Organization[]> {
    const organizations = await OrganizationModel.findAll({
      include: [
        { model: ApplicationModel, as: "applications" },
        { model: UserModel, as: "users" },
      ],
      transaction,
    });
    return organizations.map((organization) => organization.toDomain());
  }

  async delete(id: UniqueId, transaction?: any): Promise<void> {
    await OrganizationModel.destroy({ where: { id: id.toString() }, transaction });
  }

  async findByName(name: string, transaction?: any): Promise<Organization | null> {
    const organization = await OrganizationModel.findOne({ where: { name }, transaction });
    return organization ? organization.toDomain() : null;
  }

  async findApplicationById(id: UniqueId, transaction?: any): Promise<Application | null> {
    const application = await ApplicationModel.findByPk(id.toString(), { transaction });
    return application ? application.toDomain() : null;
  }
}
