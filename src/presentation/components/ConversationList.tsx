import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useConversations } from '../hooks/useConversations';

interface ConversationListProps {
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
}

type TabType = 'unassigned' | 'all' | 'pending' | 'resolved';

export function ConversationList({ selectedConversation, onSelectConversation }: ConversationListProps) {
  const { conversations, loading, reload, search, getUnassigned } = useConversations();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('unassigned');

  useEffect(() => {
    handleTabChange('unassigned');
  }, []);

  const handleTabChange = async (tab: TabType) => {
    setActiveTab(tab);
    setSearchQuery('');

    if (tab === 'unassigned') {
      await getUnassigned();
    } else if (tab === 'all') {
      await reload();
    } else {
      await reload();
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await search(query);
    } else {
      handleTabChange(activeTab);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (searchQuery.trim()) return true; // Already filtered by search

    if (activeTab === 'unassigned') return conv.assignedToUserId === null;
    if (activeTab === 'pending') return conv.status === 'pending';
    if (activeTab === 'resolved') return conv.status === 'resolved';
    return true; // 'all'
  });

  if (loading) {
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
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          <button 
            onClick={() => handleTabChange('unassigned')}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
              activeTab === 'unassigned'
                ? 'bg-amber-50 text-amber-600'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Não atribuídas
          </button>
          <button 
            onClick={() => handleTabChange('all')}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-emerald-50 text-emerald-600'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Todas
          </button>
          <button 
            onClick={() => handleTabChange('pending')}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
              activeTab === 'pending'
                ? 'bg-emerald-50 text-emerald-600'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            Pendentes
          </button>
          <button 
            onClick={() => handleTabChange('resolved')}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
              activeTab === 'resolved'
                ? 'bg-emerald-50 text-emerald-600'
                : 'text-neutral-600 hover:bg-neutral-50'
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
            {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa'}
          </p>
        ) : (
          filteredConversations.map((conversation) => {
            const isSelected = selectedConversation === conversation.id;
            
            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full p-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors text-left ${
                  isSelected ? 'bg-emerald-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 text-white">
                    {conversation.customerName.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-neutral-900 truncate">{conversation.customerName}</h3>
                        <p className="text-xs text-neutral-500">{conversation.customerPhone}</p>
                      </div>
                      <span className="text-xs text-neutral-500 ml-2 flex-shrink-0">{conversation.time}</span>
                    </div>
                    
                    <p className="text-sm text-neutral-600 truncate mb-2">
                      {conversation.lastMessage}
                    </p>

                    <div className="flex items-center justify-between">
                      {conversation.assignedToUserName ? (
                        <span className="text-xs text-neutral-500">
                          Atendente: {conversation.assignedToUserName}
                        </span>
                      ) : (
                        <Badge variant="outline" className="text-xs border-amber-200 text-amber-700 bg-amber-50">
                          Não atribuído
                        </Badge>
                      )}
                      
                      {conversation.unread > 0 && (
                        <Badge className="bg-emerald-500 text-white text-xs h-5 min-w-5 rounded-full flex items-center justify-center">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
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
