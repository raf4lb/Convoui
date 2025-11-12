import { IConversationRepository } from '../repositories/IConversationRepository';
import { Conversation } from '../entities/Conversation';

export class GetConversations {
  constructor(private conversationRepository: IConversationRepository) {}

  async execute(companyId: string): Promise<Conversation[]> {
    return await this.conversationRepository.getAll(companyId);
  }
}