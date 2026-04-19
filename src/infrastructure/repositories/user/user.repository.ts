import { UniqueId } from "@domain/@common/uniqueid";
import { User } from "@domain/identity/user";
import { Injectable } from "@nestjs/common";
import IUserRepository from "@domain/identity/user.repository";
import ClientAccountModel from "@infra/database/models/organization/client-account.model";
import UserModel from "@infra/database/models/organization/user.model";
import { BaseRepository } from "../base.repository";
import { ITransactionContext } from "@application/unit-of-work/transaction-context";

@Injectable()
export default class UserRepository extends BaseRepository implements IUserRepository {
  constructor(protected readonly context: ITransactionContext) {
    super(context);
  }

  async save(user: User): Promise<void> {
    await UserModel.upsert(
      {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        status: user.status,
        createdAt: user.createdAt,
      },
      { transaction: this.transaction },
    );

    if (user.account) {
      await ClientAccountModel.upsert(
        {
          id: user.account.id.toString(),
          userId: user.id.toString(),
          passwordHash: user.account.passwordHash,
          status: user.account.status,
          createdAt: user.account.createdAt,
        },
        { transaction: this.transaction },
      );
    }
  }

  async findById(id: UniqueId): Promise<User | null> {
    const user = await UserModel.findByPk(id.toString(), { transaction: this.transaction, include: [ClientAccountModel] });
    return user ? user.toDomain() : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ where: { email }, transaction: this.transaction, include: [ClientAccountModel] });
    return user ? user.toDomain() : null;
  }

  async findAll(): Promise<User[]> {
    const users = await UserModel.findAll({ transaction: this.transaction, include: [ClientAccountModel] });
    return users.map((user) => user.toDomain());
  }

  async delete(id: UniqueId): Promise<void> {
    await UserModel.destroy({ transaction: this.transaction, where: { id: id.toString() } });
  }
}
