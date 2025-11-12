import { User, UserWithoutPassword } from '../entities/User';

export interface IUserRepository {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getByCompanyId(companyId: string): Promise<UserWithoutPassword[]>;
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<UserWithoutPassword>;
  update(id: string, user: Partial<User>): Promise<UserWithoutPassword>;
  delete(id: string): Promise<void>;
  updateLastLogin(id: string): Promise<void>;
}
