import { useState, useEffect } from "react";

import { Customer } from "../../domain/entities/Customer";
import {
  getCustomersByCompanyUseCase,
  searchCustomersUseCase,
  createCustomerUseCase,
} from "../../infrastructure/di/container";
import { useAuth } from "../contexts/AuthContext";

export function useCustomers() {
  const { session } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (session) {
      loadCustomers();
    }
  }, [session]);

  const loadCustomers = async () => {
    if (!session) return;

    try {
      setLoading(true);
      const data = await getCustomersByCompanyUseCase.execute(session.company.id);
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const search = async (query: string) => {
    if (!session) return;

    try {
      setLoading(true);
      const data = await searchCustomersUseCase.execute(session.company.id, query);
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (data: {
    name: string;
    phone: string;
    email?: string;
    tags?: string[];
    notes?: string;
  }) => {
    if (!session) throw new Error("No session");

    const newCustomer = await createCustomerUseCase.execute({
      companyId: session.company.id,
      ...data,
    });

    setCustomers([...customers, newCustomer]);
    return newCustomer;
  };

  return { customers, loading, error, reload: loadCustomers, search, createCustomer };
}
