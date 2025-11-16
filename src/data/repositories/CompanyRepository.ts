import { Company } from "../../domain/entities/Company";
import { ICompanyRepository } from "../../domain/repositories/ICompanyRepository";

const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Tech Solutions Ltda",
    email: "contato@techsolutions.com",
    phone: "+55 11 98765-4321",
    whatsappApiKey: "mock-api-key-123",
    createdAt: new Date("2024-01-15"),
    isActive: true,
  },
  {
    id: "2",
    name: "Comércio Digital SA",
    email: "contato@comerciodigital.com",
    phone: "+55 21 99876-5432",
    whatsappApiKey: "mock-api-key-456",
    createdAt: new Date("2024-02-20"),
    isActive: true,
  },
];

export class CompanyRepository implements ICompanyRepository {
  private companies: Company[] = [...mockCompanies];

  async getById(id: string): Promise<Company | null> {
    const company = this.companies.find((c) => c.id === id);
    return Promise.resolve(company || null);
  }

  async getAll(): Promise<Company[]> {
    return Promise.resolve([...this.companies]);
  }

  async create(data: Omit<Company, "id" | "createdAt">): Promise<Company> {
    const company: Company = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    this.companies.push(company);
    return Promise.resolve(company);
  }

  async update(id: string, updates: Partial<Company>): Promise<Company> {
    const index = this.companies.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("Company not found");
    }
    this.companies[index] = { ...this.companies[index], ...updates };
    return Promise.resolve(this.companies[index]);
  }

  async delete(id: string): Promise<void> {
    const index = this.companies.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.companies.splice(index, 1);
    }
    return Promise.resolve();
  }
}
