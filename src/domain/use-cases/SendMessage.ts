import { IConversationRepository } from '../repositories/IConversationRepository';
import { Message } from '../entities/Message';

export class SendMessage {
  constructor(private conversationRepository: IConversationRepository) {}

  async execute(conversationId: string, message: Omit<Message, 'id'>): Promise<Message> {
    return await this.conversationRepository.sendMessage(conversationId, message);
  }
}
