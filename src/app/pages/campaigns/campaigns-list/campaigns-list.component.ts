import { Component, computed, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MailService } from '../../../services/mail.service';
import { CampaignApiService } from '../../../core/services/campaign-api.service';
import { Campaign, campaignProgress } from '../../../core/models/campaign.models';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-campaigns-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './campaigns-list.component.html',
  styleUrls: ['./campaigns-list.component.css']
})
export class CampaignsListComponent implements OnInit, OnDestroy {
  mailSvc      = inject(MailService);
  campaignApi  = inject(CampaignApiService);

  activeFilter = signal('Toutes');
  showDelete   = signal(false);
  deleteTarget = signal<Campaign | null>(null);

  // État de chargement des actions
  loadingAction = signal<number | null>(null);  // id de la campagne en cours d'action
  exportLoading = signal<number | null>(null);
  showExportMenu = signal<number | null>(null);
  errorMsg = signal<string | null>(null);

  filters = ['Toutes','Brouillon','En cours','Complétée','En pause','Échouée'];

  // Polling pour mettre à jour les campagnes IN_PROGRESS
  private pollSub?: Subscription;

  ngOnInit(): void {
    this.mailSvc.loadCampaigns();
    // Rafraîchit toutes les 15s si des campagnes sont en cours
    this.pollSub = interval(15000).subscribe(() => {
      const hasActive = this.mailSvc.campaigns().some(
        c => c.status === 'IN_PROGRESS' || c.status === 'PENDING'
      );
      if (hasActive) this.mailSvc.loadCampaigns();
    });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  filteredCampaigns = computed(() => {
    const f = this.activeFilter();
    const all = this.mailSvc.campaigns();
    const map: Record<string, string> = {
      'Brouillon':  'DRAFT',
      'En cours':   'IN_PROGRESS',
      'Complétée':  'COMPLETED',
      'En pause':   'PAUSED',
      'Échouée':    'FAILED',
    };
    return f === 'Toutes' ? all : all.filter(c => c.status === map[f]);
  });

  progress(c: Campaign): number {
    return campaignProgress(c);
  }

  badgeClass(s: string) {
    return {
      'active':  s === 'IN_PROGRESS',
      'done':    s === 'COMPLETED',
      'paused':  s === 'PAUSED',
      'draft':   s === 'DRAFT',
      'failed':  s === 'FAILED' || s === 'CANCELLED',
    };
  }

  statusLabel(s: string) {
    const m: Record<string, string> = {
      IN_PROGRESS: 'IN PROGRESS',
      COMPLETED:   'COMPLÉTÉE',
      PAUSED:      'EN PAUSE',
      DRAFT:       'BROUILLON',
      FAILED:      'ÉCHOUÉE',
      PENDING:     'PLANIFIÉE',
      CANCELLED:   'ANNULÉE',
    };
    return m[s] ?? s;
  }

  progressColor(s: string) {
    const m: Record<string, string> = {
      IN_PROGRESS: 'var(--color-primary)',
      COMPLETED:   'var(--color-secondary)',
      PAUSED:      '#f59e0b',
      FAILED:      'var(--color-error)',
      CANCELLED:   'var(--color-error)',
      DRAFT:       'var(--color-surface-container-highest)',
      PENDING:     '#a78bfa',
    };
    return m[s] ?? 'var(--color-primary)';
  }

  // ── Actions Lifecycle ────────────────────────────────────────────────────────

  onPause(c: Campaign): void {
    this.loadingAction.set(c.id);
    this.errorMsg.set(null);
    this.campaignApi.pauseCampaign(c.id).subscribe({
      next: updated => {
        this.mailSvc.campaigns.update(list =>
          list.map(x => x.id === updated.id ? updated : x)
        );
        this.loadingAction.set(null);
      },
      error: err => {
        this.errorMsg.set('Impossible de mettre en pause : ' + (err?.error?.message ?? err.message));
        this.loadingAction.set(null);
      },
    });
  }

  onResume(c: Campaign): void {
    this.loadingAction.set(c.id);
    this.errorMsg.set(null);
    this.campaignApi.resumeCampaign(c.id).subscribe({
      next: updated => {
        this.mailSvc.campaigns.update(list =>
          list.map(x => x.id === updated.id ? updated : x)
        );
        this.loadingAction.set(null);
        // Relancer le polling immédiat
        setTimeout(() => this.mailSvc.reloadCampaign(c.id), 3000);
      },
      error: err => {
        this.errorMsg.set('Impossible de reprendre : ' + (err?.error?.message ?? err.message));
        this.loadingAction.set(null);
      },
    });
  }

  onStart(c: Campaign): void {
    this.loadingAction.set(c.id);
    this.errorMsg.set(null);
    this.campaignApi.startCampaign(c.id).subscribe({
      next: res => {
        this.mailSvc.reloadCampaign(c.id);
        this.loadingAction.set(null);
      },
      error: err => {
        this.errorMsg.set(err?.error?.message ?? 'Erreur au démarrage de la campagne');
        this.loadingAction.set(null);
      },
    });
  }

  onRetry(c: Campaign): void {
    this.loadingAction.set(c.id);
    this.errorMsg.set(null);
    this.campaignApi.restartCampaign(c.id).subscribe({
      next: res => {
        this.mailSvc.reloadCampaign(c.id);
        this.loadingAction.set(null);
      },
      error: err => {
        this.errorMsg.set(err?.error?.message ?? 'Erreur lors du redémarrage');
        this.loadingAction.set(null);
      },
    });
  }

  onRestart(c: Campaign): void {
    this.loadingAction.set(c.id);
    this.errorMsg.set(null);
    this.campaignApi.restartCampaign(c.id).subscribe({
      next: () => {
        this.mailSvc.reloadCampaign(c.id);
        this.loadingAction.set(null);
      },
      error: err => {
        this.errorMsg.set(err?.error?.message ?? 'Erreur lors du redémarrage');
        this.loadingAction.set(null);
      },
    });
  }

  // ── Export ───────────────────────────────────────────────────────────────────

  toggleExportMenu(id: number, event: Event): void {
    event.stopPropagation();
    this.showExportMenu.update(v => v === id ? null : id);
  }

  exportPdf(c: Campaign, event: Event): void {
    event.stopPropagation();
    this.showExportMenu.set(null);
    this.exportLoading.set(c.id);
    this.campaignApi.exportPdf(c.id).subscribe({
      next: blob => {
        this.downloadBlob(blob, `rapport-${c.name}.pdf`);
        this.exportLoading.set(null);
      },
      error: () => { this.exportLoading.set(null); },
    });
  }

  exportExcel(c: Campaign, event: Event): void {
    event.stopPropagation();
    this.showExportMenu.set(null);
    this.exportLoading.set(c.id);
    this.campaignApi.exportExcel(c.id).subscribe({
      next: blob => {
        this.downloadBlob(blob, `rapport-${c.name}.xlsx`);
        this.exportLoading.set(null);
      },
      error: () => { this.exportLoading.set(null); },
    });
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Delete ───────────────────────────────────────────────────────────────────

  openDelete(c: Campaign): void {
    this.deleteTarget.set(c);
    this.showDelete.set(true);
  }

  confirmDelete(): void {
    const t = this.deleteTarget();
    if (t) this.mailSvc.deleteCampaign(t.id);
    this.showDelete.set(false);
  }

  dismissError(): void {
    this.errorMsg.set(null);
  }

  // ── Stats footer ─────────────────────────────────────────────────────────────

  totalSent = computed(() =>
    this.mailSvc.campaigns().reduce((sum, c) => sum + (c.totalSent ?? 0), 0)
  );

  totalRecipients = computed(() =>
    this.mailSvc.campaigns().reduce((sum, c) => sum + (c.totalRecipients ?? 0), 0)
  );

  deliverabilityRate = computed(() => {
    const total = this.totalRecipients();
    if (total === 0) return '—';
    const rate = (this.totalSent() / total * 100).toFixed(1);
    return rate + '%';
  });
}