import { IAttendantRepository } from '../../domain/repositories/IAttendantRepository';
import { Attendant } from '../../domain/entities/Attendant';

const mockAttendants: Attendant[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    status: 'online',
    activeChats: 3,
    totalChats: 45,
  },
  {
    id: '2',
    name: 'Ana Costa',
    email: 'ana@empresa.com',
    status: 'online',
    activeChats: 2,
    totalChats: 38,
  },
  {
    id: '3',
    name: 'Carlos Mendes',
    email: 'carlos@empresa.com',
    status: 'away',
    activeChats: 1,
    totalChats: 52,
  },
  {
    id: '4',
    name: 'Mariana Santos',
    email: 'mariana@empresa.com',
    status: 'offline',
    activeChats: 0,
    totalChats: 29,
  },
];

export class AttendantRepository implements IAttendantRepository {
  private attendants: Attendant[] = [...mockAttendants];

  async getAll(): Promise<Attendant[]> {
    return Promise.resolve([...this.attendants]);
  }

  async getById(id: string): Promise<Attendant | null> {
    const attendant = this.attendants.find(a => a.id === id);
    return Promise.resolve(attendant || null);
  }

  async create(attendant: Omit<Attendant, 'id'>): Promise<Attendant> {
    const newAttendant: Attendant = {
      ...attendant,
      id: Date.now().toString(),
    };
    this.attendants.push(newAttendant);
    return Promise.resolve(newAttendant);
  }

  async update(id: string, updates: Partial<Attendant>): Promise<Attendant> {
    const index = this.attendants.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Attendant not found');
    }
    this.attendants[index] = { ...this.attendants[index], ...updates };
    return Promise.resolve(this.attendants[index]);
  }

  async delete(id: string): Promise<void> {
    const index = this.attendants.findIndex(a => a.id === id);
    if (index !== -1) {
      this.attendants.splice(index, 1);
    }
    return Promise.resolve();
  }
}
