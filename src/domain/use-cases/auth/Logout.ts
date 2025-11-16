import { IAuthRepository } from "../../repositories/IAuthRepository";

export class Logout {
  constructor(private authRepository: IAuthRepository) {}

  async execute(token: string): Promise<void> {
    await this.authRepository.logout(token);
  }
}
