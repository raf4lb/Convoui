import { ICustomerRepository } from '../../repositories/ICustomerRepository';
import { Customer } from '../../entities/Customer';

export class CreateCustomer {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(data: {
    companyId: string;
    name: string;
    phone: string;
    email?: string;
    tags?: string[];
    notes?: string;
  }): Promise<Customer> {
    // Validate data
    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Nome deve ter no mínimo 2 caracteres');
    }

    if (!data.phone || data.phone.trim().length < 10) {
      throw new Error('Telefone inválido');
    }

    // Check if phone already exists for this company
    const existingCustomer = await this.customerRepository.getByPhone(data.phone, data.companyId);
    if (existingCustomer) {
      throw new Error('Cliente com este telefone já cadastrado');
    }

    // Create customer
    const customer = await this.customerRepository.create({
      companyId: data.companyId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      tags: data.tags || [],
      notes: data.notes,
      isBlocked: false,
    });

    return customer;
  }
}
