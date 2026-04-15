// ─── Contact List ──────────────────────────────────────────────────────────────

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

// ─── Contact ───────────────────────────────────────────────────────────────────

export type ContactStatus = 'ACTIVE' | 'SENT' | 'UNSUBSCRIBED' | 'BOUNCED' | 'SUPPRESSED' | 'INVALID';

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

// ─── Campaign ──────────────────────────────────────────────────────────────────

export type CampaignStatus =
  | 'DRAFT' | 'PENDING' | 'IN_PROGRESS' | 'PAUSED'
  | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface Campaign {
  id: number;
  name: string;
  subject: string;
  sender?: string;
  body?: string;
  status: CampaignStatus;
  contactListId?: number;
  contactListName?: string;
  templateId?: number;
  templateName?: string;
  scheduledAt?: string;
  sentAt?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  totalContacts?: number;
  totalRecipients?: number;
  totalSent?: number;
  totalFailed?: number;
  attachments?: CampaignAttachment[];
}

export interface CampaignAttachment {
  id: number;
  fileName: string;
  fileSize?: number;
  contentType?: string;
  createdAt?: string;
}