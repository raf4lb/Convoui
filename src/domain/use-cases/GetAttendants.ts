import { Attendant } from "../entities/Attendant";
import { IAttendantRepository } from "../repositories/IAttendantRepository";

export class GetAttendants {
  constructor(private attendantRepository: IAttendantRepository) {}

  async execute(): Promise<Attendant[]> {
    return await this.attendantRepository.getAll();
  }
}
