import { useEffect, useState } from "react";

import { Plus } from "lucide-react";

import { Alert, AlertDescription } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/select";
import { User, UserRole, UserWithoutPassword } from "../../domain/entities/User";

interface UserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: Partial<User>) => Promise<void>;
  user?: UserWithoutPassword; // se vier preenchido, estamos editando
  canCreateAttendant?: boolean;
  canCreateManager?: boolean;
  canCreateAdmin?: boolean;
}

export function UserFormDialog({
  open,
  setOpen,
  onSubmit,
  user,
  canCreateAttendant,
  canCreateManager,
  canCreateAdmin,
}: UserDialogProps) {
  const isEdit = !!user;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: UserRole.ATTENDANT,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: UserRole.ATTENDANT,
      });
    }
  }, [user, isEdit, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(formData);
      setOpen(false);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar usuário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        setError(null);
      }}
    >
      {/* {!isEdit && (
        <DialogTrigger asChild>
          <Button className="bg-emerald-500 hover:bg-emerald-600 gap-2">
            <Plus className="w-4 h-4" />
            Novo Usuário
          </Button>
        </DialogTrigger>
      )} */}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Usuário" : "Criar Novo Usuário"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize as informações do usuário." : "Adicione um novo usuário à empresa."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            placeholder="Nome completo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={loading}
          />

          <Input
            type="email"
            placeholder="email@empresa.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={loading}
          />

          {!isEdit && (
            <Input
              type="password"
              placeholder="Senha (mínimo 6 caracteres)"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          )}

          <Select
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de usuário" />
            </SelectTrigger>
            <SelectContent>
              {canCreateAttendant && <SelectItem value={UserRole.ATTENDANT}>Atendente</SelectItem>}
              {canCreateManager && <SelectItem value={UserRole.MANAGER}>Gerente</SelectItem>}
              {canCreateAdmin && (
                <SelectItem value={UserRole.ADMINISTRATOR}>Administrador</SelectItem>
              )}
            </SelectContent>
          </Select>

          <Button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600"
            disabled={loading}
          >
            {loading ? (isEdit ? "Salvando..." : "Criando...") : isEdit ? "Salvar" : "Criar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
