import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Campaign } from '../models/campaign.models';

@Injectable({ providedIn: 'root' })
export class CampaignApiService {
  private base = environment.campaignApi ?? 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  // ─── Campaigns ──────────────────────────────────────────────────────────────

  getAllCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.base}/api/campaigns`);
  }
}