import { Company } from "../../domain/entities/Company";

export interface CompanyDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp_api_key: string | null;
  is_active: boolean;
  attendant_sees_all_conversations: boolean;
  created_at: string;
  updated_at: string | null;
}

export function mapToCompany(dto: CompanyDTO): Company {
  // TODO: data validation
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    whatsappApiKey: dto.whatsapp_api_key,
    createdAt: new Date(dto.created_at),
    isActive: dto.is_active,
    attendantSeesAllConversations: dto.attendant_sees_all_conversations,
  };
}

export function mapToCompanyDTO(company: Company): CompanyDTO {
  // TODO: data validation
  return {
    id: company.id,
    name: company.name,
    email: company.email,
    phone: company.phone,
    whatsapp_api_key: company.whatsappApiKey,
    is_active: company.isActive,
    attendant_sees_all_conversations: company.attendantSeesAllConversations,
    created_at: company.createdAt.toISOString(),
    updated_at: null,
  };
}
