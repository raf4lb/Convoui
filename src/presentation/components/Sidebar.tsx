import { MessageSquare, Users, Settings, BarChart3 } from 'lucide-react';

interface SidebarProps {
  selectedView: 'conversations' | 'attendants' | 'dashboard';
  onViewChange: (view: 'conversations' | 'attendants' | 'dashboard') => void;
}

export function Sidebar({ selectedView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as const, icon: BarChart3, label: 'Dashboard' },
    { id: 'conversations' as const, icon: MessageSquare, label: 'Conversas' },
    { id: 'attendants' as const, icon: Users, label: 'Atendentes' },
  ];

  return (
    <div className="w-16 bg-white border-r border-neutral-200 flex flex-col items-center py-6 gap-6">
      {/* Logo */}
      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
        <MessageSquare className="w-6 h-6 text-white" />
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                isSelected
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <button 
        className="mt-auto w-11 h-11 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 transition-colors"
        title="Configurações"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
}
