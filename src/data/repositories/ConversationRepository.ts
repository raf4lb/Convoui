import { IConversationRepository } from '../../domain/repositories/IConversationRepository';
import { Conversation } from '../../domain/entities/Conversation';
import { Message } from '../../domain/entities/Message';

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Maria Silva',
    phone: '+55 11 98765-4321',
    lastMessage: 'Gostaria de saber mais sobre os produtos',
    time: '10:30',
    unread: 2,
    attendant: 'João',
    status: 'active',
  },
  {
    id: '2',
    name: 'Carlos Santos',
    phone: '+55 21 99876-5432',
    lastMessage: 'Obrigado pelo atendimento!',
    time: '09:15',
    unread: 0,
    attendant: 'Ana',
    status: 'active',
  },
  {
    id: '3',
    name: 'Fernanda Lima',
    phone: '+55 11 91234-5678',
    lastMessage: 'Quando vocês abrem?',
    time: 'Ontem',
    unread: 1,
    attendant: null,
    status: 'pending',
  },
  {
    id: '4',
    name: 'Pedro Oliveira',
    phone: '+55 11 98888-7777',
    lastMessage: 'Perfeito, vou aguardar',
    time: 'Ontem',
    unread: 0,
    attendant: 'João',
    status: 'resolved',
  },
  {
    id: '5',
    name: 'Julia Costa',
    phone: '+55 21 97777-6666',
    lastMessage: 'Preciso de ajuda urgente',
    time: '11:45',
    unread: 3,
    attendant: null,
    status: 'pending',
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      text: 'Olá! Gostaria de saber mais sobre os produtos',
      timestamp: '10:28',
      sender: 'customer',
    },
    {
      id: '2',
      text: 'Olá Maria! Claro, ficarei feliz em ajudar. Temos diversas opções disponíveis.',
      timestamp: '10:29',
      sender: 'attendant',
      attendantName: 'João',
    },
    {
      id: '3',
      text: 'Vocês fazem entrega?',
      timestamp: '10:29',
      sender: 'customer',
    },
    {
      id: '4',
      text: 'Sim! Fazemos entregas para toda a cidade. O prazo varia de 2 a 5 dias úteis.',
      timestamp: '10:30',
      sender: 'attendant',
      attendantName: 'João',
    },
    {
      id: '5',
      text: 'Gostaria de saber mais sobre os produtos',
      timestamp: '10:30',
      sender: 'customer',
    },
  ],
};

export class ConversationRepository implements IConversationRepository {
  private conversations: Conversation[] = [...mockConversations];
  private messages: Record<string, Message[]> = { ...mockMessages };

  async getAll(): Promise<Conversation[]> {
    return Promise.resolve([...this.conversations]);
  }

  async getById(id: string): Promise<Conversation | null> {
    const conversation = this.conversations.find(c => c.id === id);
    return Promise.resolve(conversation || null);
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const messages = this.messages[conversationId] || [];
    return Promise.resolve([...messages]);
  }

  async assignAttendant(conversationId: string, attendantName: string | null): Promise<void> {
    const conversation = this.conversations.find(c => c.id === conversationId);
    if (conversation) {
      conversation.attendant = attendantName;
    }
    return Promise.resolve();
  }

  async sendMessage(conversationId: string, message: Omit<Message, 'id'>): Promise<Message> {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
    };
    
    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    
    this.messages[conversationId].push(newMessage);
    return Promise.resolve(newMessage);
  }
}
