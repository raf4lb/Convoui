import { Conversation } from "../../entities/Conversation";
import { UserRole, UserWithoutPassword } from "../../entities/User";
import { IConversationRepository } from "../../repositories/IConversationRepository";

export class GetConversations {
  constructor(private conversationRepository: IConversationRepository) {}

  async execute(user: UserWithoutPassword): Promise<Conversation[]> {
    if (user.role == UserRole.ATTENDANT) {
      return await this.conversationRepository.getByAttendant(user);
    }
    return await this.conversationRepository.getAll(user.companyId);
  }
}
