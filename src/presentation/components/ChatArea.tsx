import { useState } from "react";

import { Check, MoreVertical, Paperclip, Send, Smile, User } from "lucide-react";

import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../components/ui/command";
import { Input } from "../../components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Permission } from "../../domain/entities/Permission";
import { UserRole } from "../../domain/entities/User";
import { useAuth } from "../contexts/AuthContext";
import { useConversationMessages } from "../hooks/useConversationMessages";
import { useConversations } from "../hooks/useConversations";
import { useUsers } from "../hooks/useUsers";

interface ChatAreaProps {
  conversationId: string | null;
}

export function ChatArea({ conversationId }: ChatAreaProps) {
  const { hasPermission } = useAuth();
  const { messages, loading } = useConversationMessages(conversationId);
  const { conversations, assignAttendant } = useConversations();
  const { users } = useUsers();
  const [openAssignPopover, setOpenAssignPopover] = useState(false);

  const currentConversation = conversations.find((c) => c.id === conversationId);

  const canAssingConversation = hasPermission(Permission.ASSIGN_CONVERSATION);

  // Filter only attendants
  const attendants = users.filter((u) => u.role === UserRole.ATTENDANT);

  const handleAssignAttendant = async (userId: string | null, userName: string | null) => {
    if (conversationId) {
      await assignAttendant(conversationId, userId, userName);
      setOpenAssignPopover(false);
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-neutral-50">
        <div className="text-center text-neutral-400">
          <MessageSquare className="w-16 h-16 mx-auto mb-4" />
          <p>Selecione uma conversa para começar</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <p className="text-neutral-500">Carregando mensagens...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="h-16 border-b border-neutral-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
              {currentConversation?.customerName.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-neutral-900">{currentConversation?.customerName || "Usuário"}</h3>
            <p className="text-xs text-neutral-500">{currentConversation?.customerPhone || ""}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canAssingConversation && (
            <Popover open={openAssignPopover} onOpenChange={setOpenAssignPopover}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  {currentConversation?.assignedToUserName || "Atribuir"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="end">
                <Command>
                  <CommandInput placeholder="Buscar atendente..." />
                  <CommandEmpty>Nenhum atendente encontrado.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => handleAssignAttendant(null, null)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          !currentConversation?.assignedToUserId ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      Não atribuído
                    </CommandItem>
                    {attendants.map((attendant) => (
                      <CommandItem
                        key={attendant.id}
                        value={attendant.name}
                        onSelect={() => handleAssignAttendant(attendant.id, attendant.name)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            currentConversation?.assignedToUserId === attendant.id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs">
                            {attendant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm">{attendant.name}</p>
                            <p className="text-xs text-neutral-500">{attendant.email}</p>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          )}
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "customer" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-md px-4 py-2.5 rounded-2xl ${
                message.sender === "customer"
                  ? "bg-neutral-100 text-neutral-900"
                  : "bg-emerald-500 text-white"
              }`}
            >
              {message.sender === "attendant" && message.attendantName && (
                <p className="text-xs opacity-80 mb-1">{message.attendantName}</p>
              )}
              <p className="text-sm">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "customer" ? "text-neutral-500" : "text-emerald-100"
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-neutral-200 p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Paperclip className="w-5 h-5" />
          </Button>

          <Input placeholder="Digite sua mensagem..." className="flex-1 border-neutral-200" />

          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Smile className="w-5 h-5" />
          </Button>

          <Button size="icon" className="flex-shrink-0 bg-emerald-500 hover:bg-emerald-600">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      strokeWidth="1.5"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    </svg>
  );
}
