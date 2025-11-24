import { useEffect, useState } from "react";

import { Conversation } from "../../domain/entities/Conversation";
import { Permission } from "../../domain/entities/Permission";
import { UserRole } from "../../domain/entities/User";
import { IEventBus } from "../../domain/ports/EventBus";
import {
  assignConversationToAttendantUseCase,
  getConversationUseCase,
} from "../../infrastructure/di/container";
import { useAuth } from "../contexts/AuthContext";

import { useConversationMessages } from "./useConversationMessages";
import { useUsers } from "./useUsers";

export function useChatAreaState(conversationId: string | null, eventBus: IEventBus) {
  const { session, hasPermission } = useAuth();
  const { messages, loading, isSendingMessage, sendMessage } = useConversationMessages(
    conversationId,
    eventBus,
  );
  const { users } = useUsers();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [openAssignPopover, setOpenAssignPopover] = useState(false);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    const loadConversation = async () => {
      const conversation =
        conversationId && session
          ? await getConversationUseCase.execute(conversationId, session.user)
          : null;
      setConversation(conversation);
    };
    loadConversation();
  }, [conversationId, session]);

  const canAssingConversation = hasPermission(Permission.ASSIGN_CONVERSATION);

  // const attendants = getCompanyAttendants.execute(session?.user.companyId)
  const attendants = users.filter((u) => u.role === UserRole.ATTENDANT);

  const handleAssignAttendant = async (userId: string | null, userName: string | null) => {
    if (conversationId) {
      await assignConversationToAttendantUseCase.execute(conversationId, userId, userName);
      // await conversationsHook.assignAttendant(conversationId, userId, userName);
      setOpenAssignPopover(false);
    }
  };

  const handleSendMessage = async () => {
    if (!conversationId || !session) return;
    await sendMessage(messageText, session.user.name);
    // conversationsHook.setConversations((prev) =>
    //   prev.map((conv) =>
    //     conv.id === conversationId ? { ...conv, lastMessage: messageText } : conv,
    //   ),
    // );
    setMessageText("");
  };

  const assignConversationToUser = async () => {
    if (!session) return;
    handleAssignAttendant(session.user.id, session.user.name);
  };

  const canAssignConversationToUser =
    session &&
    conversation &&
    !conversation.assignedToUserId &&
    session.user.role === UserRole.ATTENDANT;

  return {
    session,
    hasPermission,
    messages,
    loading,
    isSendingMessage,
    sendMessage,
    users,
    openAssignPopover,
    setOpenAssignPopover,
    messageText,
    setMessageText,
    canAssingConversation,
    conversation,
    handleAssignAttendant,
    attendants,
    canAssignConversationToUser,
    assignConversationToUser,
    handleSendMessage,
  };
}
