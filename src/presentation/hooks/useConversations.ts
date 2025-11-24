import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

import { Conversation } from "../../domain/entities/Conversation";
import {
  ConversationAssignedEvent,
  ConversationAssignedPayload,
} from "../../domain/events/ConversationAssignedEvent";
import { EventType } from "../../domain/events/DomainEvent";
import { MessageSentEvent, MessageSentPayload } from "../../domain/events/MessageCreatedEvent";
import { IEventBus } from "../../domain/ports/EventBus";
import {
  getConversationsUseCase,
  searchConversationsUseCase,
} from "../../infrastructure/di/container";
import { useAuth } from "../contexts/AuthContext";

export interface ConversationsHook {
  conversations: Conversation[];
  setConversations: Dispatch<SetStateAction<Conversation[]>>;
  loading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
  search: (query: string) => Promise<void>;
  getUnassigned: () => Promise<void>;
  assignAttendant: (
    conversationId: string,
    userId: string | null,
    userName: string | null,
  ) => Promise<void>;
}

export function useConversations(eventBus: IEventBus) {
  const { session } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadConversations = useCallback(async () => {
    if (!session) throw new Error("No session");

    try {
      setLoading(true);
      const data = await getConversationsUseCase.execute(session.user);
      setConversations(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      loadConversations();

      const unsubscribeMessageSentEvent = eventBus.subscribe<MessageSentEvent>(
        EventType.MESSAGE_SENT,
        async (event) => {
          onMessageSent(event.payload);
        },
      );

      const unsubscribeConversationAssignedEvent = eventBus.subscribe<ConversationAssignedEvent>(
        EventType.CONVERSATION_ASSIGNED,
        async (event) => {
          onConversationAssigned(event.payload);
        },
      );

      return () => {
        unsubscribeMessageSentEvent();
        unsubscribeConversationAssignedEvent();
      };
    }
  }, [session, loadConversations, eventBus]);

  const search = async (query: string) => {
    if (!session) throw new Error("No session");

    try {
      setLoading(true);
      const data = await searchConversationsUseCase.execute(session.company.id, query);
      setConversations(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const onMessageSent = (payload: MessageSentPayload) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === payload.conversationId
          ? {
              ...conv,
              lastMessage: payload.message.text,
              updatedAt: new Date(),
            }
          : conv,
      ),
    );
  };

  const onConversationAssigned = (payload: ConversationAssignedPayload) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === payload.conversationId
          ? { ...conv, assignedToUserId: payload.userId, assignedToUserName: payload.userName }
          : conv,
      ),
    );
  };

  return {
    conversations,
    setConversations,
    loading,
    error,
    reload: loadConversations,
    search,
  };
}
