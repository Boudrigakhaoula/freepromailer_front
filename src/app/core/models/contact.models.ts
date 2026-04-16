export interface ContactList {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  totalContactCount?: number;
  activeContactCount?: number;
  campaignCount?: number;
}

export interface ContactListRequest {
  name: string;
  description?: string;
}

export type ContactStatus =
  | 'ACTIVE'
  | 'SENT'
  | 'UNSUBSCRIBED'
  | 'BOUNCED'
  | 'SUPPRESSED'
  | 'INVALID';

export interface Contact {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  status: ContactStatus;
  contactListId?: number;
  contactListName?: string;
  unsubscribedAt?: string;
  bouncedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  contactListId: number;
}

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: number;
  errorDetails?: string[];
}
