import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Campaign, CampaignStatus } from '../models/campaign.models';

export interface CampaignCreatePayload {
  name: string;
  subject: string;
  sender?: string;
  body?: string;
  contactListId?: number | null;
  templateId?: number | null;
  scheduledAt?: string | null;
  attachments?: File[];
}

export interface CampaignStartResponse {
  campaignId: number;
  name: string;
  status: string;
  totalRecipients: number;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class CampaignApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.campaignApi ?? 'http://localhost:8080';

  // ── Lecture ──────────────────────────────────────────────────────────────────

  getAllCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.base}/api/campaigns`);
  }

  getCampaignById(id: number): Observable<Campaign> {
    return this.http.get<Campaign>(`${this.base}/api/campaigns/${id}`);
  }

  getCampaignsByStatus(status: CampaignStatus): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.base}/api/campaigns/status/${status}`);
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────────

  createCampaign(payload: CampaignCreatePayload): Observable<Campaign> {
    const fd = this.buildFormData(payload);
    return this.http.post<Campaign>(`${this.base}/api/campaigns`, fd);
  }

  updateCampaign(id: number, payload: CampaignCreatePayload): Observable<Campaign> {
    const fd = this.buildFormData(payload);
    return this.http.put<Campaign>(`${this.base}/api/campaigns/${id}`, fd);
  }

  deleteCampaign(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/campaigns/${id}`);
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────────

  startCampaign(id: number): Observable<CampaignStartResponse> {
    return this.http.post<CampaignStartResponse>(
      `${this.base}/api/campaigns/${id}/start`, {}
    );
  }

  pauseCampaign(id: number): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.base}/api/campaigns/${id}/pause`, {});
  }

  resumeCampaign(id: number): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.base}/api/campaigns/${id}/resume`, {});
  }

  restartCampaign(id: number): Observable<CampaignStartResponse> {
    return this.http.post<CampaignStartResponse>(
      `${this.base}/api/campaigns/${id}/restart`, {}
    );
  }

  cancelCampaign(id: number): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.base}/api/campaigns/${id}/cancel`, {});
  }

  // ── Exports ───────────────────────────────────────────────────────────────────

  exportPdf(id: number): Observable<Blob> {
    return this.http.get(
      `${this.base}/api/campaigns/${id}/export/pdf`,
      { responseType: 'blob' }
    );
  }

  exportExcel(id: number): Observable<Blob> {
    return this.http.get(
      `${this.base}/api/campaigns/${id}/export/excel`,
      { responseType: 'blob' }
    );
  }

  exportJson(id: number): Observable<any> {
    return this.http.get(`${this.base}/api/campaigns/${id}/export/json`);
  }

  // ── Pièces jointes ────────────────────────────────────────────────────────────

  uploadAttachment(campaignId: number, file: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<any>(
      `${this.base}/api/campaigns/${campaignId}/attachments`, fd
    );
  }

  deleteAttachment(campaignId: number, attachmentId: number): Observable<any> {
    return this.http.delete<any>(
      `${this.base}/api/campaigns/${campaignId}/attachments/${attachmentId}`
    );
  }

  // ── Helper FormData ───────────────────────────────────────────────────────────

  private buildFormData(payload: CampaignCreatePayload): FormData {
    const fd = new FormData();
    fd.append('name', payload.name);
    fd.append('subject', payload.subject);
    if (payload.sender)        fd.append('sender', payload.sender);
    if (payload.body)          fd.append('body', payload.body);
    if (payload.contactListId) fd.append('contactListId', String(payload.contactListId));
    if (payload.templateId)    fd.append('templateId', String(payload.templateId));
    if (payload.scheduledAt)   fd.append('scheduledAt', payload.scheduledAt);
    if (payload.attachments?.length) {
      payload.attachments.forEach(f => fd.append('attachments', f));
    }
    return fd;
  }
}