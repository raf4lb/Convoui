import { Customer } from "../entities/Customer";

export interface ICustomerRepository {
  getById(id: string): Promise<Customer | null>;
  getByCompanyId(companyId: string): Promise<Customer[]>;
  getByPhone(phone: string, companyId: string): Promise<Customer | null>;
  search(companyId: string, query: string): Promise<Customer[]>;
  create(customer: Omit<Customer, "id" | "createdAt">): Promise<Customer>;
  update(id: string, customer: Partial<Customer>): Promise<Customer>;
  delete(id: string): Promise<void>;
}
