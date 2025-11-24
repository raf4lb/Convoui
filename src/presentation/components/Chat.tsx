import { useState } from "react";

import { ChatArea } from "./ChatArea";
import { ConversationList } from "./ConversationList";

export function Chat() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <>
      {/* Conversation List */}
      <ConversationList
        selectedConversation={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
      />

      {/* Chat Area */}
      <ChatArea conversationId={selectedConversationId} />
    </>
  );
}
