import { IUserRepository } from '../../repositories/IUserRepository';
import { UserWithoutPassword, UserRole } from '../../entities/User';
import { Permission, RolePermissions } from '../../entities/Permission';

export class GetUsersByCompany {
  constructor(private userRepository: IUserRepository) {}

  async execute(companyId: string, userRole: UserRole): Promise<UserWithoutPassword[]> {
    // Check permission
    const permissions = RolePermissions[userRole];
    if (!permissions.includes(Permission.VIEW_USERS)) {
      throw new Error('Sem permissão para visualizar usuários');
    }

    return await this.userRepository.getByCompanyId(companyId);
  }
}
