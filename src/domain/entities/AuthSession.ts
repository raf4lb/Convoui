import { UserWithoutPassword } from './User';
import { Company } from './Company';

export interface AuthSession {
  user: UserWithoutPassword;
  company: Company;
  token: string;
  expiresAt: Date;
}
