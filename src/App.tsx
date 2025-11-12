import { useState } from 'react';
import { AuthProvider, useAuth } from './presentation/contexts/AuthContext';
import { Login } from './presentation/components/Login';
import { Sidebar } from './presentation/components/Sidebar';
import { ConversationList } from './presentation/components/ConversationList';
import { ChatArea } from './presentation/components/ChatArea';
import { Dashboard } from './presentation/components/Dashboard';
import { UserManagement } from './presentation/components/UserManagement';
import { CustomerManagement } from './presentation/components/CustomerManagement';

function AppContent() {
  const { session, loading } = useAuth();
  const [selectedView, setSelectedView] = useState<'conversations' | 'customers' | 'dashboard' | 'users'>('dashboard');
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <p className="text-neutral-500">Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

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
        ) : selectedView === 'customers' ? (
          <CustomerManagement />
        ) : selectedView === 'users' ? (
          <UserManagement />
        ) : (
          <Dashboard />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}