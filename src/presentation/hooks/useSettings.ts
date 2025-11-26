import React, { useEffect, useState } from "react";

import { Company } from "../../domain/entities/Company";
import { getCompanyUseCase, updateCompanyUseCase } from "../../infrastructure/di/container";
import { useAuth } from "../contexts/AuthContext";

export function useSettingsState() {
  const { session, hasPermission } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<Company>>({
    name: "",
    email: "",
    phone: "",
    whatsappApiKey: "",
    attendantSeesAllConversations: false,
  });

  useEffect(() => {
    if (!session) throw new Error("No session");

    const loadCompany = async () => {
      setIsLoading(true);
      try {
        const company = await getCompanyUseCase.execute(session.company.id, session.user.role);
        setFormData(company);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao atualizar empresa");
      }
      setIsLoading(false);
    };
    loadCompany();
  }, [session, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) throw new Error("No session");
    setError("");
    setIsUpdating(true);

    try {
      await updateCompanyUseCase.execute(session.company.id, { ...formData }, session.user.role);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar empresa");
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    error,
    handleSubmit,
    setFormData,
    formData,
    isLoading,
    isUpdating,
    hasPermission,
  };
}
