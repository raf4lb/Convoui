import { Attendant } from "../entities/Attendant";

export interface IAttendantRepository {
  getAll(): Promise<Attendant[]>;
  getById(id: string): Promise<Attendant | null>;
  create(attendant: Omit<Attendant, "id">): Promise<Attendant>;
  update(id: string, attendant: Partial<Attendant>): Promise<Attendant>;
  delete(id: string): Promise<void>;
}
