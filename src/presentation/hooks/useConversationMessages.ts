import { useCallback, useEffect, useState } from "react";

import { Message } from "../../domain/entities/Message";
import { EventType } from "../../domain/events/DomainEvent";
import { MessageSentEvent } from "../../domain/events/MessageCreatedEvent";
import { IEventBus } from "../../domain/ports/EventBus";
import {
  getConversationMessagesUseCase,
  sendMessageUseCase,
} from "../../infrastructure/di/container";

export function useConversationMessages(conversationId: string | null, eventBus: IEventBus) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const loadMessages = useCallback(async () => {
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
  }, [conversationId]);

  const onMessageSent = useCallback(
    (messageConversationId: string, message: Message) => {
      if (messageConversationId != conversationId) return;
      setMessages((prev) => [...prev, message]);
    },
    [conversationId],
  );

  useEffect(() => {
    if (conversationId) {
      loadMessages();
    }

    const unsubscribe = eventBus.subscribe<MessageSentEvent>(EventType.MESSAGE_SENT, (event) => {
      if (event.payload.conversationId != conversationId) return;
      onMessageSent(event.payload.conversationId, event.payload.message);
    });

    return () => unsubscribe();
  }, [conversationId, loadMessages, eventBus, onMessageSent]);

  const sendMessage = async (text: string, attendantName: string) => {
    if (!conversationId) return;
    try {
      setIsSendingMessage(true);
      await sendMessageUseCase.execute(conversationId, {
        text: text,
        timestamp: new Date().toISOString(),
        sender: "attendant",
        attendantName: attendantName,
      });
      // setMessages([...messages, newMessage]);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  return {
    messages,
    loading,
    error,
    reload: loadMessages,
    isSendingMessage,
    sendMessage,
  };
}
