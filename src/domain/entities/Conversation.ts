export interface Conversation {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  time: string;
  unread: number;
  attendant: string | null;
  status: 'active' | 'pending' | 'resolved';
}
