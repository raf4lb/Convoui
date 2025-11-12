import { useState } from 'react';
import { Plus, Search, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { useUsers } from '../hooks/useUsers';
import { UserRole } from '../../domain/entities/User';
import { Permission } from '../../domain/entities/Permission';
import { RoleBadge } from './RoleBadge';

export function UserManagement() {
  const { session, hasPermission } = useAuth();
  const { users, loading, search, createUser, deleteUser } = useUsers();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: UserRole.ATTENDANT,
  });
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!session) return null;

  const canCreateAdmin = hasPermission(Permission.CREATE_ADMINISTRATOR);
  const canCreateManager = hasPermission(Permission.CREATE_MANAGER);
  const canCreateAttendant = hasPermission(Permission.CREATE_ATTENDANT);
  const canCreateAny = canCreateAdmin || canCreateManager || canCreateAttendant;

  const handleSearch = (query: string, role?: UserRole | 'all') => {
    setSearchQuery(query);
    const roleToSearch = role !== 'all' ? role : undefined;
    search(query, roleToSearch);
  };

  const handleRoleFilterChange = (role: string) => {
    const selectedRole = role as UserRole | 'all';
    setRoleFilter(selectedRole);
    handleSearch(searchQuery, selectedRole);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      await createUser(formData);
      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: UserRole.ATTENDANT,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar usuário');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUserId) return;

    setDeleting(true);
    try {
      await deleteUser(deleteUserId);
      setDeleteUserId(null);
    } catch (err) {
      console.error('Error deleting user:', err);
    } finally {
      setDeleting(false);
    }
  };

  const canEditUser = (userRole: UserRole) => {
    if (userRole === UserRole.ADMINISTRATOR) return canCreateAdmin;
    if (userRole === UserRole.MANAGER) return canCreateManager;
    if (userRole === UserRole.ATTENDANT) return canCreateAttendant;
    return false;
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="mb-1">Usuários</h2>
            <p className="text-sm text-neutral-500">
              Gerencie os usuários da empresa {session.company.name}
            </p>
          </div>
          {canCreateAny && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600 gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Usuário</DialogTitle>
                  <DialogDescription>
                    Adicione um novo usuário à sua empresa
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm text-neutral-700">Nome</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nome completo"
                      required
                      disabled={creating}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-neutral-700">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@empresa.com"
                      required
                      disabled={creating}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-neutral-700">Senha</label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                      required
                      disabled={creating}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-neutral-700">Tipo de Usuário</label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                      disabled={creating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {canCreateAttendant && (
                          <SelectItem value={UserRole.ATTENDANT}>Atendente</SelectItem>
                        )}
                        {canCreateManager && (
                          <SelectItem value={UserRole.MANAGER}>Gerente</SelectItem>
                        )}
                        {canCreateAdmin && (
                          <SelectItem value={UserRole.ADMINISTRATOR}>Administrador</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                    disabled={creating}
                  >
                    {creating ? 'Criando...' : 'Criar Usuário'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input 
              placeholder="Buscar por nome ou email..." 
              className="pl-9 bg-neutral-50 border-0"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value, roleFilter)}
            />
          </div>
          <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
            <SelectTrigger className="w-48 bg-neutral-50 border-0">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {canCreateAttendant && <SelectItem value={UserRole.ATTENDANT}>Atendentes</SelectItem>}
              {canCreateManager && <SelectItem value={UserRole.MANAGER}>Gerentes</SelectItem>}
              {canCreateAdmin && <SelectItem value={UserRole.ADMINISTRATOR}>Administradores</SelectItem>}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="text-neutral-500 text-center">Carregando...</p>
        ) : users.length === 0 ? (
          <p className="text-neutral-500 text-center">Nenhum usuário encontrado</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white">
                        {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <CardTitle className="text-base">{user.name}</CardTitle>
                        <p className="text-xs text-neutral-500 mt-0.5">{user.email}</p>
                      </div>
                    </div>
                    {canEditUser(user.role) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteUserId(user.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <RoleBadge role={user.role} />
                    <Badge variant={user.isActive ? 'default' : 'secondary'} className={
                      user.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''
                    }>
                      {user.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deletando...' : 'Deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
