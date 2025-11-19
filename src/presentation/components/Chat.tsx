import { useState } from "react";

import { useConversations } from "../hooks/useConversations";

import { ChatArea } from "./ChatArea";
import { ConversationList } from "./ConversationList";

export function Chat() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1");
  const conversationsHook = useConversations();

  return (
    <>
      {/* Conversation List */}
      <ConversationList
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        conversationsHook={conversationsHook}
      />

      {/* Chat Area */}
      <ChatArea conversationId={selectedConversation} conversationsHook={conversationsHook} />
    </>
  );
}
