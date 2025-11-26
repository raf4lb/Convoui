export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsappApiKey?: string;
  createdAt: Date;
  isActive: boolean;
  attendantSeesAllConversations: boolean;
}
