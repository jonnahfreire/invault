import { UniqueId } from "@domain/@common/uniqueid";
import { User } from "@domain/identity/user";
import { Injectable } from "@nestjs/common";
import IUserRepository from "@domain/identity/user.repository";
import ClientAccountModel from "@infra/database/models/organization/client-account.model";
import UserModel from "@infra/database/models/organization/user.model";

@Injectable()
export default class UserRepository implements IUserRepository {
  async save(user: User, transaction?: any): Promise<void> {
    await UserModel.upsert(
      {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        status: user.status,
        createdAt: user.createdAt,
      },
      transaction,
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
        transaction,
      );
    }
  }

  async findById(id: UniqueId, transaction?: any): Promise<User | null> {
    const user = await UserModel.findByPk(id.toString(), { transaction, include: [ClientAccountModel] });
    return user ? user.toDomain() : null;
  }

  async findByEmail(email: string, transaction?: any): Promise<User | null> {
    const user = await UserModel.findOne({ where: { email }, transaction, include: [ClientAccountModel] });
    return user ? user.toDomain() : null;
  }

  async findAll(transaction?: any): Promise<User[]> {
    const users = await UserModel.findAll({ transaction, include: [ClientAccountModel] });
    return users.map((user) => user.toDomain());
  }

  async delete(id: UniqueId, transaction?: any): Promise<void> {
    await UserModel.destroy({ transaction, where: { id: id.toString() } });
  }
}
