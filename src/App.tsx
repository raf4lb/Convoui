import { useState } from 'react';
import { Sidebar } from './presentation/components/Sidebar';
import { ConversationList } from './presentation/components/ConversationList';
import { ChatArea } from './presentation/components/ChatArea';
import { AttendantPanel } from './presentation/components/AttendantPanel';
import { Dashboard } from './presentation/components/Dashboard';

export default function App() {
  const [selectedView, setSelectedView] = useState<'conversations' | 'attendants' | 'dashboard'>('dashboard');
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <Sidebar selectedView={selectedView} onViewChange={setSelectedView} />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {selectedView === 'conversations' ? (
          <>
            {/* Conversation List */}
            <ConversationList 
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
            />
            
            {/* Chat Area */}
            <ChatArea conversationId={selectedConversation} />
          </>
        ) : selectedView === 'attendants' ? (
          <AttendantPanel />
        ) : (
          <Dashboard />
        )}
      </div>
    </div>
  );
}