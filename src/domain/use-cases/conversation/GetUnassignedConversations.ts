import { IConversationRepository } from '../../repositories/IConversationRepository';
import { Conversation } from '../../entities/Conversation';

export class GetUnassignedConversations {
  constructor(private conversationRepository: IConversationRepository) {}

  async execute(companyId: string): Promise<Conversation[]> {
    return await this.conversationRepository.getUnassigned(companyId);
  }
}
