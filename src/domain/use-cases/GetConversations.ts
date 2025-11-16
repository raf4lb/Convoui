import { Conversation } from "../entities/Conversation";
import { IConversationRepository } from "../repositories/IConversationRepository";

export class GetConversations {
  constructor(private conversationRepository: IConversationRepository) {}

  async execute(companyId: string): Promise<Conversation[]> {
    return await this.conversationRepository.getAll(companyId);
  }
}
