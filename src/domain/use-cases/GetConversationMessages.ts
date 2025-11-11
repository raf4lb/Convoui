import { IConversationRepository } from '../repositories/IConversationRepository';
import { Message } from '../entities/Message';

export class GetConversationMessages {
  constructor(private conversationRepository: IConversationRepository) {}

  async execute(conversationId: string): Promise<Message[]> {
    return await this.conversationRepository.getMessages(conversationId);
  }
}
