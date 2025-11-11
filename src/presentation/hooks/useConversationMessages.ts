import { useState, useEffect } from 'react';
import { Message } from '../../domain/entities/Message';
import { getConversationMessagesUseCase } from '../../infrastructure/di/container';

export function useConversationMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
    }
  }, [conversationId]);

  const loadMessages = async () => {
    if (!conversationId) return;
    
    try {
      setLoading(true);
      const data = await getConversationMessagesUseCase.execute(conversationId);
      setMessages(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, error, reload: loadMessages };
}
