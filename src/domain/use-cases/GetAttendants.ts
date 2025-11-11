import { IAttendantRepository } from '../repositories/IAttendantRepository';
import { Attendant } from '../entities/Attendant';

export class GetAttendants {
  constructor(private attendantRepository: IAttendantRepository) {}

  async execute(): Promise<Attendant[]> {
    return await this.attendantRepository.getAll();
  }
}
