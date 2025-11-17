import { useCallback, useEffect, useState } from "react";

import { Conversation } from "../../domain/entities/Conversation";
import {
  assignConversationToAttendantUseCase,
  getConversationsUseCase,
  getUnassignedConversationsUseCase,
  searchConversationsUseCase,
} from "../../infrastructure/di/container";
import { useAuth } from "../contexts/AuthContext";

export function useConversations() {
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
    }
  }, [session, loadConversations]);

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

  const getUnassigned = async () => {
    if (!session) throw new Error("No session");

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
