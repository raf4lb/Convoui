# Presentation Layer (Camada de Apresentação)

Esta camada é responsável por toda a **interface do usuário** e **interação com o usuário**. Ela se conecta com a camada de domínio através de custom hooks.

## Estrutura

### 🎨 Components (Componentes)
Componentes React puros focados apenas em renderização e interação visual.

- **Sidebar**: Menu lateral de navegação
- **ConversationList**: Lista de conversas
- **ChatArea**: Área de chat com mensagens
- **AttendantPanel**: Painel de gerenciamento de atendentes
- **Dashboard**: Dashboard com métricas e gráficos

### 🪝 Hooks (Custom Hooks)
Fazem a ponte entre os componentes React e os use cases do domínio.

- **useConversations**: Gerencia lista de conversas
- **useConversationMessages**: Gerencia mensagens de uma conversa
- **useAttendants**: Gerencia lista de atendentes
- **useMetrics**: Gerencia métricas do dashboard

## Responsabilidades

### Components
✅ Renderizar UI
✅ Capturar eventos do usuário
✅ Usar custom hooks para obter dados
✅ Gerenciar estado local de UI (modals, dropdowns, etc.)

❌ Conter lógica de negócio
❌ Fazer chamadas diretas a repositórios
❌ Conhecer detalhes de implementação de dados

### Hooks
✅ Chamar use cases
✅ Gerenciar estado de loading/error
✅ Prover dados formatados para componentes
✅ Atualizar dados quando necessário

❌ Conter lógica de negócio
❌ Manipular dados diretamente
❌ Fazer validações de regras de negócio

## Exemplo de Fluxo

```typescript
// 1. Component usa o hook
function ConversationList() {
  const { conversations, loading } = useConversations();
  
  if (loading) return <div>Carregando...</div>;
  
  return (
    <div>
      {conversations.map(conv => (
        <div key={conv.id}>{conv.name}</div>
      ))}
    </div>
  );
}

// 2. Hook chama o use case
function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getConversationsUseCase.execute();
      setConversations(data);
      setLoading(false);
    };
    load();
  }, []);
  
  return { conversations, loading };
}

// 3. Use case acessa o repositório
class GetConversations {
  async execute() {
    return await this.conversationRepository.getAll();
  }
}
```

## Vantagens

- **Componentes limpos**: Focados apenas em UI
- **Reusabilidade**: Hooks podem ser usados em múltiplos componentes
- **Testabilidade**: Componentes e hooks podem ser testados separadamente
- **Separação**: UI não conhece detalhes de implementação de dados
