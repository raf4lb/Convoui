import { User, UserRole, UserWithoutPassword } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

const mockUsers: User[] = [
  {
    id: "1",
    companyId: "1",
    name: "Admin User",
    email: "admin@techsolutions.com",
    password: "123456", // In production, this should be hashed
    role: UserRole.ADMINISTRATOR,
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    companyId: "1",
    name: "João Silva",
    email: "joao@techsolutions.com",
    password: "123456",
    role: UserRole.ATTENDANT,
    isActive: true,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    companyId: "1",
    name: "Ana Costa",
    email: "ana@techsolutions.com",
    password: "123456",
    role: UserRole.ATTENDANT,
    isActive: true,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "4",
    companyId: "1",
    name: "Carlos Mendes",
    email: "carlos@techsolutions.com",
    password: "123456",
    role: UserRole.MANAGER,
    isActive: true,
    createdAt: new Date("2024-01-18"),
  },
  {
    id: "5",
    companyId: "2",
    name: "Admin Comércio",
    email: "admin@comerciodigital.com",
    password: "123456",
    role: UserRole.ADMINISTRATOR,
    isActive: true,
    createdAt: new Date("2024-02-20"),
  },
];

export class UserRepository implements IUserRepository {
  private users: User[] = [...mockUsers];

  async getById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return Promise.resolve(user || null);
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    return Promise.resolve(user || null);
  }

  async getByCompanyId(companyId: string): Promise<UserWithoutPassword[]> {
    const users = this.users.filter((u) => u.companyId === companyId).map(this.removePassword);
    return Promise.resolve(users);
  }

  async create(data: Omit<User, "id" | "createdAt">): Promise<UserWithoutPassword> {
    const user: User = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    this.users.push(user);
    return Promise.resolve(this.removePassword(user));
  }

  async update(id: string, updates: Partial<User>): Promise<UserWithoutPassword> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    this.users[index] = { ...this.users[index], ...updates };
    return Promise.resolve(this.removePassword(this.users[index]));
  }

  async delete(id: string): Promise<void> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
    return Promise.resolve();
  }

  async updateLastLogin(id: string): Promise<void> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users[index].lastLoginAt = new Date();
    }
    return Promise.resolve();
  }

  private removePassword(user: User): UserWithoutPassword {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
