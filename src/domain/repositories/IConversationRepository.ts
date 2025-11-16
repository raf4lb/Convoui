import { Conversation } from "../entities/Conversation";
import { Message } from "../entities/Message";

export interface IConversationRepository {
  getAll(companyId: string): Promise<Conversation[]>;
  getById(id: string): Promise<Conversation | null>;
  getMessages(conversationId: string): Promise<Message[]>;
  assignAttendant(
    conversationId: string,
    userId: string | null,
    userName: string | null,
  ): Promise<void>;
  sendMessage(conversationId: string, message: Omit<Message, "id">): Promise<Message>;
  search(companyId: string, query: string): Promise<Conversation[]>;
  getUnassigned(companyId: string): Promise<Conversation[]>;
}
