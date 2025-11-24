import { Conversation } from "../../entities/Conversation";
import { AuthUser, UserRole } from "../../entities/User";
import { IConversationRepository } from "../../repositories/IConversationRepository";

export class GetConversation {
  constructor(private conversationRepository: IConversationRepository) {}

  async execute(conversationId: string, user: AuthUser): Promise<Conversation | null> {
    const conversation = await this.conversationRepository.getById(user.companyId, conversationId);
    if (
      conversation &&
      conversation.assignedToUserId &&
      user.role == UserRole.ATTENDANT &&
      conversation.assignedToUserId != user.id
    ) {
      return null;
    }
    return conversation;
  }
}
