import { Company } from "./Company";
import { UserWithoutPassword } from "./User";

export interface AuthSession {
  user: UserWithoutPassword;
  company: Company;
  token: string;
  expiresAt: Date;
}
