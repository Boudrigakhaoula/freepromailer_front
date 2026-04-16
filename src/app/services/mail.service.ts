import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Campaign, campaignProgress } from '../core/models/campaign.models';
import { CampaignApiService } from '../core/services/campaign-api.service';

export interface Template {
  id: number;
  name: string;
  category: string;
  lastUsed: string;
  image: string;
  htmlContent?: string;
  textContent?: string;
}

@Injectable({ providedIn: 'root' })
export class MailService {
  private readonly http = inject(HttpClient);
  private readonly campaignApi = inject(CampaignApiService);
  private readonly base = environment.campaignApi ?? 'http://localhost:8080';

  // ── Campaigns ─────────────────────────────────────────────────────────────────

  /** Signal réactif des campagnes — chargé depuis le backend */
  campaigns = signal<Campaign[]>([]);

  /** Charge (ou recharge) toutes les campagnes depuis le backend */
  loadCampaigns(): void {
    this.campaignApi.getAllCampaigns().subscribe({
      next: list => this.campaigns.set(list),
      error: err  => console.error('Erreur chargement campagnes', err),
    });
  }

  /** Recharge une seule campagne et met à jour le signal */
  reloadCampaign(id: number): void {
    this.campaignApi.getCampaignById(id).subscribe({
      next: updated => {
        this.campaigns.update(list =>
          list.map(c => c.id === updated.id ? updated : c)
        );
      },
    });
  }

  /** Supprime une campagne (appel API + mise à jour du signal) */
  deleteCampaign(id: number): void {
    this.campaignApi.deleteCampaign(id).subscribe({
      next: () => this.campaigns.update(list => list.filter(c => c.id !== id)),
      error: err => console.error('Erreur suppression campagne', err),
    });
  }

  /** Calcule la progression d'une campagne */
  getProgress(c: Campaign): number {
    return campaignProgress(c);
  }

  // ── Templates ─────────────────────────────────────────────────────────────────

  /** Templates chargés depuis le backend */
  private _templates = signal<Template[]>([]);
  templates = this._templates.asReadonly();

  loadTemplates(): void {
    this.http.get<any[]>(`${this.base}/api/templates`).subscribe({
      next: list => {
        const mapped: Template[] = list.map(t => ({
          id:          t.id,
          name:        t.name,
          category:    t.category ?? 'OTHER',
          lastUsed:    t.updatedAt
            ? new Date(t.updatedAt).toLocaleDateString('fr-FR')
            : 'Jamais',
          image:       `https://picsum.photos/seed/${t.id}/400/300`,
          htmlContent: t.htmlContent,
          textContent: t.textContent,
        }));
        this._templates.set(mapped);
      },
      error: err => console.error('Erreur chargement templates', err),
    });
  }

  deleteTemplate(id: number): void {
    this.http.delete(`${this.base}/api/templates/${id}`).subscribe({
      next: () => this._templates.update(list => list.filter(t => t.id !== id)),
      error: err => console.error('Erreur suppression template', err),
    });
  }
}