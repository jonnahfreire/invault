import { UniqueId } from "@domain/@common/uniqueid";
import { Membership } from "@domain/organization/membership";
import { IMembershipRepository } from "@domain/organization/membership.repository";
import MembershipModel from "@infra/database/models/organization/membership.model";
import MembershipRoleModel from "@infra/database/models/organization/membership-role.model";
import PermissionModel from "@infra/database/models/organization/permission.model";
import RoleModel from "@infra/database/models/organization/role.model";
import RolePermissionModel from "@infra/database/models/organization/role-permission.model";
import { ITransactionContext } from "@application/unit-of-work/transaction-context";
import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";

@Injectable()
export default class MembershipRepository extends BaseRepository implements IMembershipRepository {
  constructor(protected readonly context: ITransactionContext) {
    super(context);
  }

  async save(membership: Membership): Promise<void> {
    for (const role of membership.props.roles ?? []) {
      await RoleModel.upsert(
        {
          id: role.id.toString(),
          name: role.props.name,
          organizationId: role.props.organizationId?.toString() ?? null,
          parentRoleId: role.props.parentRoleId?.toString() ?? null,
        },
        { transaction: this.transaction },
      );

      for (const permission of role.permissions) {
        await PermissionModel.upsert(
          {
            id: permission.id.toString(),
            resource: permission.props.resource,
            action: permission.props.action,
          },
          { transaction: this.transaction },
        );

        await RolePermissionModel.upsert({ roleId: role.id.toString(), permissionId: permission.id.toString() }, { transaction: this.transaction });
      }
    }

    await MembershipModel.upsert(
      {
        id: membership.id.toString(),
        userId: membership.props.userId.toString(),
        organizationId: membership.props.organizationId.toString(),
        active: membership.props.active,
        joinedAt: membership.props.joinedAt ?? new Date(),
      },
      { transaction: this.transaction },
    );

    for (const role of membership.props.roles ?? []) {
      await MembershipRoleModel.upsert({ membershipId: membership.id.toString(), roleId: role.id.toString(), active: true }, { transaction: this.transaction });
    }
  }

  async findById(id: UniqueId): Promise<Membership | null> {
    const row = await MembershipModel.findByPk(id.toString(), {
      include: [{ model: RoleModel, as: "roles" }],
      transaction: this.transaction,
    });
    return row ? row.toDomain() : null;
  }

  async findByUserId(userId: UniqueId): Promise<Membership[]> {
    const rows = await MembershipModel.findAll({
      where: { userId: userId.toString() },
      include: [{ model: RoleModel, as: "roles" }],
      transaction: this.transaction,
    });
    return rows.map((r) => r.toDomain());
  }

  async findByOrganizationId(organizationId: UniqueId): Promise<Membership[]> {
    const rows = await MembershipModel.findAll({
      where: { organizationId: organizationId.toString() },
      include: [{ model: RoleModel, as: "roles" }],
      transaction: this.transaction,
    });
    return rows.map((r) => r.toDomain());
  }

  async findByUserAndOrganization(userId: UniqueId, organizationId: UniqueId): Promise<Membership | null> {
    const row = await MembershipModel.findOne({
      where: { userId: userId.toString(), organizationId: organizationId.toString() },
      include: [{ model: RoleModel, as: "roles", required: true }],
      transaction: this.transaction,
    });
    return row ? row.toDomain() : null;
  }

  async delete(id: UniqueId): Promise<void> {
    await MembershipModel.destroy({ where: { id: id.toString() }, transaction: this.transaction });
  }
}
