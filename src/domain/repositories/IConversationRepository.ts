import { Conversation } from '../entities/Conversation';
import { Message } from '../entities/Message';

export interface IConversationRepository {
  getAll(): Promise<Conversation[]>;
  getById(id: string): Promise<Conversation | null>;
  getMessages(conversationId: string): Promise<Message[]>;
  assignAttendant(conversationId: string, attendantName: string | null): Promise<void>;
  sendMessage(conversationId: string, message: Omit<Message, 'id'>): Promise<Message>;
}
