import { ICustomerRepository } from '../../repositories/ICustomerRepository';
import { Customer } from '../../entities/Customer';

export class GetCustomersByCompany {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(companyId: string): Promise<Customer[]> {
    return await this.customerRepository.getByCompanyId(companyId);
  }
}
