import { Conversation } from "../../entities/Conversation";
import { IConversationRepository } from "../../repositories/IConversationRepository";

export class GetUnassignedConversations {
  constructor(private conversationRepository: IConversationRepository) {}

  async execute(companyId: string): Promise<Conversation[]> {
    return await this.conversationRepository.getUnassigned(companyId);
  }
}
