import { Message } from "../entities/Message";
import { IConversationRepository } from "../repositories/IConversationRepository";

export class SendMessage {
  constructor(private conversationRepository: IConversationRepository) {}

  async execute(conversationId: string, message: Omit<Message, "id">): Promise<Message> {
    return await this.conversationRepository.sendMessage(conversationId, message);
  }
}
