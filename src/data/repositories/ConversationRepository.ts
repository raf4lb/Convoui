import { Conversation, ConversationStatus } from "../../domain/entities/Conversation";
import { Message } from "../../domain/entities/Message";
import { UserWithoutPassword } from "../../domain/entities/User";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";

const mockConversations: Conversation[] = [
  {
    id: "1",
    companyId: "1",
    customerId: "1",
    customerName: "Maria Silva",
    customerPhone: "+55 11 98765-4321",
    lastMessage: "Gostaria de saber mais sobre os produtos",
    time: "10:30",
    unread: 2,
    assignedToUserId: "2",
    assignedToUserName: "João Silva",
    status: ConversationStatus.PENDING,
    createdAt: new Date("2024-11-12T10:00:00"),
    updatedAt: new Date("2024-11-12T10:30:00"),
  },
  {
    id: "2",
    companyId: "1",
    customerId: "2",
    customerName: "Carlos Santos",
    customerPhone: "+55 21 99876-5432",
    lastMessage: "Obrigado pelo atendimento!",
    time: "09:15",
    unread: 0,
    assignedToUserId: "3",
    assignedToUserName: "Ana Costa",
    status: ConversationStatus.ACTIVE,
    createdAt: new Date("2024-11-12T09:00:00"),
    updatedAt: new Date("2024-11-12T09:15:00"),
  },
  {
    id: "3",
    companyId: "1",
    customerId: "3",
    customerName: "Fernanda Lima",
    customerPhone: "+55 11 91234-5678",
    lastMessage: "Quando vocês abrem?",
    time: "Ontem",
    unread: 1,
    assignedToUserId: null,
    assignedToUserName: null,
    status: ConversationStatus.PENDING,
    createdAt: new Date("2024-11-11T14:00:00"),
    updatedAt: new Date("2024-11-11T14:20:00"),
  },
  {
    id: "4",
    companyId: "1",
    customerId: "4",
    customerName: "Pedro Oliveira",
    customerPhone: "+55 11 98888-7777",
    lastMessage: "Perfeito, vou aguardar",
    time: "Ontem",
    unread: 0,
    assignedToUserId: "2",
    assignedToUserName: "João Silva",
    status: ConversationStatus.RESOLVED,
    createdAt: new Date("2024-11-11T16:00:00"),
    updatedAt: new Date("2024-11-11T16:45:00"),
  },
  {
    id: "5",
    companyId: "1",
    customerId: "5",
    customerName: "Julia Costa",
    customerPhone: "+55 21 97777-6666",
    lastMessage: "Preciso de ajuda urgente",
    time: "11:45",
    unread: 3,
    assignedToUserId: null,
    assignedToUserName: null,
    status: ConversationStatus.PENDING,
    createdAt: new Date("2024-11-12T11:30:00"),
    updatedAt: new Date("2024-11-12T11:45:00"),
  },
];

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      text: "Olá! Gostaria de saber mais sobre os produtos",
      timestamp: "10:28",
      sender: "customer",
    },
    {
      id: "2",
      text: "Olá Maria! Claro, ficarei feliz em ajudar. Temos diversas opções disponíveis.",
      timestamp: "10:29",
      sender: "attendant",
      attendantName: "João Silva",
    },
    {
      id: "3",
      text: "Vocês fazem entrega?",
      timestamp: "10:29",
      sender: "customer",
    },
    {
      id: "4",
      text: "Sim! Fazemos entregas para toda a cidade. O prazo varia de 2 a 5 dias úteis.",
      timestamp: "10:30",
      sender: "attendant",
      attendantName: "João Silva",
    },
    {
      id: "5",
      text: "Gostaria de saber mais sobre os produtos",
      timestamp: "10:30",
      sender: "customer",
    },
  ],
  "2": [
    {
      id: "1",
      text: "Bom dia! Gostaria de fazer uma reclamação sobre o produto",
      timestamp: "09:00",
      sender: "customer",
    },
    {
      id: "2",
      text: "Bom dia, Carlos! Sinto muito pelo inconveniente. Pode me contar o que aconteceu?",
      timestamp: "09:05",
      sender: "attendant",
      attendantName: "Ana Costa",
    },
    {
      id: "3",
      text: "O produto chegou com defeito",
      timestamp: "09:07",
      sender: "customer",
    },
    {
      id: "4",
      text: "Entendo. Vou providenciar a troca imediatamente. Pode me enviar uma foto?",
      timestamp: "09:10",
      sender: "attendant",
      attendantName: "Ana Costa",
    },
    {
      id: "5",
      text: "Claro, vou enviar agora",
      timestamp: "09:12",
      sender: "customer",
    },
    {
      id: "6",
      text: "Perfeito! Já estou abrindo o chamado de troca. Você receberá o produto novo em até 3 dias úteis.",
      timestamp: "09:14",
      sender: "attendant",
      attendantName: "Ana Costa",
    },
    {
      id: "7",
      text: "Obrigado pelo atendimento!",
      timestamp: "09:15",
      sender: "customer",
    },
  ],
  "3": [
    {
      id: "1",
      text: "Olá!",
      timestamp: "14:18",
      sender: "customer",
    },
    {
      id: "2",
      text: "Quando vocês abrem?",
      timestamp: "14:20",
      sender: "customer",
    },
  ],
  "4": [
    {
      id: "1",
      text: "Boa tarde! Vocês têm o produto X em estoque?",
      timestamp: "16:30",
      sender: "customer",
    },
    {
      id: "2",
      text: "Boa tarde, Pedro! Sim, temos disponível. Quantas unidades você precisa?",
      timestamp: "16:35",
      sender: "attendant",
      attendantName: "João Silva",
    },
    {
      id: "3",
      text: "Preciso de 5 unidades",
      timestamp: "16:37",
      sender: "customer",
    },
    {
      id: "4",
      text: "Temos sim! Vou separar para você. Pode retirar hoje ainda?",
      timestamp: "16:40",
      sender: "attendant",
      attendantName: "João Silva",
    },
    {
      id: "5",
      text: "Perfeito, vou aguardar",
      timestamp: "16:45",
      sender: "customer",
    },
  ],
  "5": [
    {
      id: "1",
      text: "Socorro!",
      timestamp: "11:40",
      sender: "customer",
    },
    {
      id: "2",
      text: "Preciso de ajuda urgente",
      timestamp: "11:42",
      sender: "customer",
    },
    {
      id: "3",
      text: "Meu pedido não chegou e preciso dele hoje",
      timestamp: "11:45",
      sender: "customer",
    },
  ],
};

export class ConversationRepository implements IConversationRepository {
  private conversations: Conversation[] = [...mockConversations];
  private messages: Record<string, Message[]> = { ...mockMessages };

  async getAll(companyId: string): Promise<Conversation[]> {
    const conversations = this.conversations.filter((c) => c.companyId === companyId);
    return Promise.resolve([...conversations]);
  }

  async getById(id: string): Promise<Conversation | null> {
    const conversation = this.conversations.find((c) => c.id === id);
    return Promise.resolve(conversation || null);
  }

  async getByAttendant(user: UserWithoutPassword): Promise<Conversation[]> {
    const conversations = this.conversations.filter(
      (c) =>
        c.companyId === user.companyId &&
        (c.assignedToUserId == user.id || c.assignedToUserId == null),
    );
    return Promise.resolve([...conversations]);
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const messages = this.messages[conversationId] || [];
    return Promise.resolve([...messages]);
  }

  async assignAttendant(
    conversationId: string,
    userId: string | null,
    userName: string | null,
  ): Promise<void> {
    const conversation = this.conversations.find((c) => c.id === conversationId);
    if (conversation) {
      conversation.assignedToUserId = userId;
      conversation.assignedToUserName = userName;
      conversation.updatedAt = new Date();
    }
    return Promise.resolve();
  }

  async sendMessage(conversationId: string, message: Omit<Message, "id">): Promise<Message> {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
    };

    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }

    this.messages[conversationId].push(newMessage);

    // Update conversation
    const conversation = this.conversations.find((c) => c.id === conversationId);
    if (conversation) {
      conversation.lastMessage = message.text;
      conversation.updatedAt = new Date();
    }

    return Promise.resolve(newMessage);
  }

  async search(companyId: string, query: string): Promise<Conversation[]> {
    const lowerQuery = query.toLowerCase();
    const conversations = this.conversations.filter(
      (c) =>
        c.companyId === companyId &&
        (c.customerName.toLowerCase().includes(lowerQuery) ||
          c.customerPhone.includes(query) ||
          c.lastMessage.toLowerCase().includes(lowerQuery)),
    );
    return Promise.resolve(conversations);
  }

  async getUnassigned(companyId: string): Promise<Conversation[]> {
    const conversations = this.conversations.filter(
      (c) => c.companyId === companyId && c.assignedToUserId === null,
    );
    return Promise.resolve(conversations);
  }
}
