export interface Customer {
  id: string;
  companyId: string;
  name: string;
  phone: string;
  email?: string | null;
  tags?: string[];
  notes?: string;
  createdAt: Date;
  lastContactAt?: Date;
  isBlocked: boolean;
}
