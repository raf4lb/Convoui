import { Company } from "../entities/Company";

export interface ICompanyRepository {
  getById(id: string): Promise<Company | null>;
  getAll(): Promise<Company[]>;
  create(company: Omit<Company, "id" | "createdAt">): Promise<Company>;
  update(id: string, company: Partial<Company>): Promise<Company>;
  delete(id: string): Promise<void>;
}
