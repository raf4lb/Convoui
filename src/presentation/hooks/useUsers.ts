import { useState, useEffect } from 'react';
import { UserWithoutPassword, UserRole } from '../../domain/entities/User';
import { 
  getUsersByCompanyUseCase, 
  createUserUseCase,
  updateUserUseCase,
  deleteUserUseCase,
  searchUsersUseCase
} from '../../infrastructure/di/container';
import { useAuth } from '../contexts/AuthContext';

export function useUsers() {
  const { session } = useAuth();
  const [users, setUsers] = useState<UserWithoutPassword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (session) {
      loadUsers();
    }
  }, [session]);

  const loadUsers = async () => {
    if (!session) return;

    try {
      setLoading(true);
      const data = await getUsersByCompanyUseCase.execute(
        session.company.id,
        session.user.role
      );
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const search = async (query: string, roleFilter?: UserRole) => {
    if (!session) return;

    try {
      setLoading(true);
      const data = await searchUsersUseCase.execute(
        session.company.id,
        query,
        roleFilter
      );
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => {
    if (!session) throw new Error('No session');

    const newUser = await createUserUseCase.execute(
      {
        companyId: session.company.id,
        ...data,
      },
      session.user.role
    );

    setUsers([...users, newUser]);
    return newUser;
  };

  const updateUser = async (userId: string, updates: Partial<UserWithoutPassword>) => {
    if (!session) throw new Error('No session');

    const updatedUser = await updateUserUseCase.execute(
      userId,
      updates,
      session.user.role
    );

    setUsers(users.map(u => u.id === userId ? updatedUser : u));
    return updatedUser;
  };

  const deleteUser = async (userId: string) => {
    if (!session) throw new Error('No session');

    await deleteUserUseCase.execute(userId, session.user.role);
    setUsers(users.filter(u => u.id !== userId));
  };

  return { 
    users, 
    loading, 
    error, 
    reload: loadUsers, 
    search,
    createUser,
    updateUser,
    deleteUser
  };
}