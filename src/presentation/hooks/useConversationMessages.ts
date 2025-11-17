import { useEffect, useState } from "react";

import { Message } from "../../domain/entities/Message";
import {
  getConversationMessagesUseCase,
  sendMessageUseCase,
} from "../../infrastructure/di/container";

export function useConversationMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

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

  const sendMessage = async (text: string, attendantName: string) => {
    if (!conversationId) return;
    try {
      setIsSendingMessage(true);
      const newMessage = await sendMessageUseCase.execute(conversationId, {
        text: text,
        timestamp: new Date().toISOString(),
        sender: "attendant",
        attendantName: attendantName,
      });
      setMessages([...messages, newMessage]);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  return { messages, loading, error, reload: loadMessages, isSendingMessage, sendMessage };
}
