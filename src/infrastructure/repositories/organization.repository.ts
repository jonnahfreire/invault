import { UniqueId } from "@domain/@common/uniqueid";
import { Application } from "@domain/organization/application";
import { Organization } from "@domain/organization/organization";
import { IOrganizationRepository } from "@domain/organization/organization.repository";
import OrganizationModel from "@infra/database/models/organization/organization.model";

export default class OrganizationRepository implements IOrganizationRepository {
  async save(entity: Organization, transaction?: any): Promise<void> {
    await OrganizationModel.create(
      {
        id: entity.id.toString(),
        name: entity.props.name,
        status: entity.props.status,
      },
      { transaction },
    );
  }

  async findById(id: UniqueId, transaction?: any): Promise<Organization | null> {
    const organization = await OrganizationModel.findOne({
      where: { id: id.toString() },
      transaction,
    });

    return organization ? organization.toDomain() : null;
  }

  async findAll(transaction?: any): Promise<Organization[]> {
    const organizations = await OrganizationModel.findAll({ transaction });
    return organizations.map((organization) => organization.toDomain());
  }

  async delete(id: UniqueId, transaction?: any): Promise<void> {
    await OrganizationModel.destroy({ where: { id: id.toString() }, transaction });
  }

  findTenantById(tenantId: UniqueId, transaction?: any): Promise<Application | null> {
    console.log(tenantId, transaction);
    throw new Error("Method not implemented.");
  }
}
