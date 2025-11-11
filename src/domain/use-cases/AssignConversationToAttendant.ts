import { IConversationRepository } from '../repositories/IConversationRepository';

export class AssignConversationToAttendant {
  constructor(private conversationRepository: IConversationRepository) {}

  async execute(conversationId: string, attendantName: string | null): Promise<void> {
    await this.conversationRepository.assignAttendant(conversationId, attendantName);
  }
}
