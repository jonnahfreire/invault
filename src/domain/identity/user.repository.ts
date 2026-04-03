import { IRepository } from "@domain/@common/repository";
import { User } from "./user";

export default abstract class IUserRepository extends IRepository<User> {
  abstract findByEmail(email: string, transaction?: any): Promise<User | null>;
}
