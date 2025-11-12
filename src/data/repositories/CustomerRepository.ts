import { ICustomerRepository } from '../../domain/repositories/ICustomerRepository';
import { Customer } from '../../domain/entities/Customer';

const mockCustomers: Customer[] = [
  {
    id: '1',
    companyId: '1',
    name: 'Maria Silva',
    phone: '+55 11 98765-4321',
    email: 'maria.silva@email.com',
    tags: ['VIP', 'Cliente Recorrente'],
    notes: 'Cliente muito importante, sempre compra produtos premium',
    createdAt: new Date('2024-01-10'),
    lastContactAt: new Date('2024-11-12T10:30:00'),
    isBlocked: false,
  },
  {
    id: '2',
    companyId: '1',
    name: 'Carlos Santos',
    phone: '+55 21 99876-5432',
    email: 'carlos.santos@email.com',
    tags: ['Novo Cliente'],
    createdAt: new Date('2024-02-15'),
    lastContactAt: new Date('2024-11-12T09:15:00'),
    isBlocked: false,
  },
  {
    id: '3',
    companyId: '1',
    name: 'Fernanda Lima',
    phone: '+55 11 91234-5678',
    tags: ['Interessado'],
    createdAt: new Date('2024-03-20'),
    lastContactAt: new Date('2024-11-11T14:20:00'),
    isBlocked: false,
  },
  {
    id: '4',
    companyId: '1',
    name: 'Pedro Oliveira',
    phone: '+55 11 98888-7777',
    email: 'pedro.oliveira@email.com',
    createdAt: new Date('2024-04-05'),
    lastContactAt: new Date('2024-11-11T16:45:00'),
    isBlocked: false,
  },
  {
    id: '5',
    companyId: '1',
    name: 'Julia Costa',
    phone: '+55 21 97777-6666',
    email: 'julia.costa@email.com',
    tags: ['Urgente'],
    notes: 'Precisa de atendimento prioritário',
    createdAt: new Date('2024-05-12'),
    lastContactAt: new Date('2024-11-12T11:45:00'),
    isBlocked: false,
  },
  {
    id: '6',
    companyId: '2',
    name: 'Roberto Alves',
    phone: '+55 11 95555-4444',
    email: 'roberto.alves@email.com',
    createdAt: new Date('2024-02-25'),
    lastContactAt: new Date('2024-11-10T10:00:00'),
    isBlocked: false,
  },
];

export class CustomerRepository implements ICustomerRepository {
  private customers: Customer[] = [...mockCustomers];

  async getById(id: string): Promise<Customer | null> {
    const customer = this.customers.find(c => c.id === id);
    return Promise.resolve(customer || null);
  }

  async getByCompanyId(companyId: string): Promise<Customer[]> {
    const customers = this.customers.filter(c => c.companyId === companyId);
    return Promise.resolve(customers);
  }

  async getByPhone(phone: string, companyId: string): Promise<Customer | null> {
    const customer = this.customers.find(c => c.phone === phone && c.companyId === companyId);
    return Promise.resolve(customer || null);
  }

  async search(companyId: string, query: string): Promise<Customer[]> {
    const lowerQuery = query.toLowerCase();
    const customers = this.customers.filter(c => 
      c.companyId === companyId &&
      (c.name.toLowerCase().includes(lowerQuery) ||
       c.phone.includes(query) ||
       c.email?.toLowerCase().includes(lowerQuery) ||
       c.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
    return Promise.resolve(customers);
  }

  async create(data: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    const customer: Customer = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    this.customers.push(customer);
    return Promise.resolve(customer);
  }

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    this.customers[index] = { ...this.customers[index], ...updates };
    return Promise.resolve(this.customers[index]);
  }

  async delete(id: string): Promise<void> {
    const index = this.customers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.customers.splice(index, 1);
    }
    return Promise.resolve();
  }
}
