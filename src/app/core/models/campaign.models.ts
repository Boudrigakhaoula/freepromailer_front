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