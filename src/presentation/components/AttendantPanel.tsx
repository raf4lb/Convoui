import { Plus, Search, MoreVertical, Mail, MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { useAttendants } from "../hooks/useAttendants";

export function AttendantPanel() {
  const { attendants, loading } = useAttendants();

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="mb-1">Atendentes</h2>
            <p className="text-sm text-neutral-500">Gerencie os atendentes da sua equipe</p>
          </div>
          <Button className="bg-emerald-500 hover:bg-emerald-600 gap-2">
            <Plus className="w-4 h-4" />
            Novo Atendente
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input placeholder="Buscar atendentes..." className="pl-9 bg-neutral-50 border-0" />
        </div>
      </div>

      {/* Attendants Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="text-neutral-500 text-center">Carregando...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {attendants.map((attendant) => (
              <div
                key={attendant.id}
                className="border border-neutral-200 rounded-xl p-5 hover:border-emerald-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                          {attendant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          attendant.status === "online"
                            ? "bg-emerald-500"
                            : attendant.status === "away"
                              ? "bg-amber-500"
                              : "bg-neutral-300"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-neutral-900">{attendant.name}</h3>
                      <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {attendant.email}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Ver estatísticas</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Remover</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    variant={
                      attendant.status === "online"
                        ? "default"
                        : attendant.status === "away"
                          ? "secondary"
                          : "outline"
                    }
                    className={
                      attendant.status === "online"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : attendant.status === "away"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-neutral-50 text-neutral-600"
                    }
                  >
                    {attendant.status === "online"
                      ? "Online"
                      : attendant.status === "away"
                        ? "Ausente"
                        : "Offline"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    <span className="text-neutral-600">{attendant.activeChats} ativas</span>
                  </div>
                  <span className="text-sm text-neutral-500">{attendant.totalChats} total</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
