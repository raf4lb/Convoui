import { IConversationRepository } from '../../repositories/IConversationRepository';
import { Conversation } from '../../entities/Conversation';

export class SearchConversations {
  constructor(private conversationRepository: IConversationRepository) {}

  async execute(companyId: string, query: string): Promise<Conversation[]> {
    if (!query || query.trim().length === 0) {
      return await this.conversationRepository.getAll(companyId);
    }
    
    return await this.conversationRepository.search(companyId, query.trim());
  }
}
