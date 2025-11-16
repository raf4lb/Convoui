import { useState, useEffect } from "react";

import { Conversation } from "../../domain/entities/Conversation";
import {
  getConversationsUseCase,
  searchConversationsUseCase,
  getUnassignedConversationsUseCase,
  assignConversationToAttendantUseCase,
} from "../../infrastructure/di/container";
import { useAuth } from "../contexts/AuthContext";

export function useConversations() {
  const { session } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (session) {
      loadConversations();
    }
  }, [session]);

  const loadConversations = async () => {
    if (!session) return;

    try {
      setLoading(true);
      const data = await getConversationsUseCase.execute(session.company.id);
      setConversations(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const search = async (query: string) => {
    if (!session) return;

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

  const getUnassigned = async () => {
    if (!session) return;

    try {
      setLoading(true);
      const data = await getUnassignedConversationsUseCase.execute(session.company.id);
      setConversations(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const assignAttendant = async (
    conversationId: string,
    userId: string | null,
    userName: string | null,
  ) => {
    await assignConversationToAttendantUseCase.execute(conversationId, userId, userName);

    // Update local state
    setConversations(
      conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, assignedToUserId: userId, assignedToUserName: userName }
          : conv,
      ),
    );
  };

  return {
    conversations,
    loading,
    error,
    reload: loadConversations,
    search,
    getUnassigned,
    assignAttendant,
  };
}
