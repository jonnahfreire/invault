import { User } from "../../domain/identity/user";
import { Role } from "../../domain/organization/role";
import { Permission } from "../../domain/organization/permission";
import { UniqueId } from "../../domain/@common/uniqueid";

export class AuthService {
  // Simple in-memory user store for demo
  private users = new Map<string, { user: User; password: string }>();
  private roles = new Map<string, Role>();

  registerUser(user: User, password: string): void {
    this.users.set(user.props.name, { user, password });
  }

  authenticate(username: string, password: string): User | null {
    const entry = this.users.get(username);
    if (entry && entry.password === password) {
      return entry.user;
    }
    return null;
  }

  assignRoleToUser(userId: UniqueId, role: Role): void {
    this.roles.set(userId.toString(), role);
  }

  getUserRole(userId: UniqueId): Role | null {
    return this.roles.get(userId.toString()) || null;
  }

  hasPermission(userId: UniqueId, permission: Permission): boolean {
    const role = this.getUserRole(userId);
    if (!role) return false;

    return role.permissions.some((p) => p.equals(permission));
  }

  authorize(userId: UniqueId, resource: string, action: string): boolean {
    const permission = Permission.create(resource as any, action as any);
    return this.hasPermission(userId, permission);
  }
}
