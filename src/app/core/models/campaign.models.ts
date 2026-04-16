// ─── Campaign ──────────────────────────────────────────────────────────────────

export type CampaignStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

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

/** Calcule la progression d'une campagne en % */
export function campaignProgress(c: Campaign): number {
  if (c.status === 'COMPLETED') return 100;
  if (c.status === 'DRAFT' || c.status === 'PENDING') {
    return c.totalRecipients ? Math.round((c.totalSent ?? 0) / c.totalRecipients * 100) : 0;
  }
  if (!c.totalRecipients || c.totalRecipients === 0) {
    // fallback : afficher totalSent si totalRecipients pas encore connu
    return c.totalSent ?? 0;
  }
  return Math.min(100, Math.round((c.totalSent ?? 0) / c.totalRecipients * 100));
}