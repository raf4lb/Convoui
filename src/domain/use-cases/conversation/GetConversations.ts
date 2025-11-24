import { Conversation } from "../../entities/Conversation";
import { AuthUser, UserRole } from "../../entities/User";
import { IConversationRepository } from "../../repositories/IConversationRepository";

export class GetConversations {
  constructor(private conversationRepository: IConversationRepository) {}

  async execute(user: AuthUser): Promise<Conversation[]> {
    if (user.role == UserRole.ATTENDANT) {
      return await this.conversationRepository.getByAttendant(user);
    }
    return await this.conversationRepository.getAll(user.companyId);
  }
}
