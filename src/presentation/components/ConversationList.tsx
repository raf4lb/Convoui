import { useState } from "react";

import { Headset, Search } from "lucide-react";

import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { ConversationStatus } from "../../domain/entities/Conversation";
import { UserRole } from "../../domain/entities/User";
import { eventBus } from "../../infrastructure/di/container";
import { useAuth } from "../contexts/AuthContext";
import { useConversations } from "../hooks/useConversations";

interface ConversationListProps {
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
}

enum TabType {
  ALL = "all",
  PENDING = "pending",
  RESOLVED = "resolved",
  UNASSIGNED = "unassigned",
}

export function ConversationList({
  selectedConversation,
  onSelectConversation,
}: ConversationListProps) {
  const { session } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>(TabType.UNASSIGNED);
  const conversationsHook = useConversations(eventBus);

  if (!session) return null;

  const handleTabChange = async (tab: TabType) => {
    setActiveTab(tab);
    await conversationsHook.reload();
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await conversationsHook.search(query);
    } else {
      await conversationsHook.reload();
    }
  };

  let filteredConversations = conversationsHook.conversations.filter((conv) => {
    if (searchQuery.trim()) return true; // Already filtered by search

    if (activeTab === TabType.UNASSIGNED) return conv.assignedToUserId === null;
    if (activeTab === TabType.PENDING) return conv.unread > 0 && conv.assignedToUserId !== null;
    if (activeTab === TabType.RESOLVED) return conv.status === ConversationStatus.RESOLVED;
    return true; // 'all'
  });

  filteredConversations = [...filteredConversations].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
  );

  if (conversationsHook.loading) {
    return (
      <div className="w-96 bg-white border-r border-neutral-200 flex items-center justify-center">
        <p className="text-neutral-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white border-r border-neutral-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <h2 className="mb-4">Conversas</h2>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Buscar conversas..."
            className="pl-9 bg-neutral-50 border-0"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => handleTabChange(TabType.UNASSIGNED)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
              activeTab === "unassigned"
                ? "bg-amber-50 text-amber-600"
                : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            Não atribuídas
          </button>
          <button
            onClick={() => handleTabChange(TabType.PENDING)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
              activeTab === TabType.PENDING
                ? "bg-emerald-50 text-emerald-600"
                : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => handleTabChange(TabType.ALL)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
              activeTab === TabType.ALL
                ? "bg-emerald-50 text-emerald-600"
                : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => handleTabChange(TabType.RESOLVED)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
              activeTab === TabType.RESOLVED
                ? "bg-emerald-50 text-emerald-600"
                : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            Resolvidas
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <p className="text-neutral-500 text-center p-4">
            {searchQuery ? "Nenhuma conversa encontrada" : "Nenhuma conversa"}
          </p>
        ) : (
          filteredConversations.map((conversation) => {
            const isSelected = selectedConversation === conversation.id;

            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full p-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors text-left ${
                  isSelected ? "bg-emerald-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0 text-white">
                    {conversation.customerName.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-neutral-900 truncate">{conversation.customerName}</h3>
                        <p className="text-xs text-neutral-500">{conversation.customerPhone}</p>
                      </div>
                      <span className="text-xs text-neutral-500 ml-2 shrink-0">
                        {conversation.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-neutral-600 truncate mb-2 mt-2">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <Badge className="bg-emerald-500 text-white text-xs h-5 min-w-5 rounded-full flex items-center justify-center">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>

                    {!conversation.assignedToUserId ? (
                      <Badge
                        variant="outline"
                        className="text-xs border-amber-200 text-amber-700 bg-amber-50"
                      >
                        Não atribuído
                      </Badge>
                    ) : (
                      (session.company.attendantSeesAllConversations ||
                        session.user.role !== UserRole.ATTENDANT) && (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          <span className="flex items-center gap-1">
                            <Headset className="w-3 h-3" />
                            {conversation.assignedToUserId != session.user.id
                              ? conversation.assignedToUserName
                              : "Você"}
                          </span>
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
