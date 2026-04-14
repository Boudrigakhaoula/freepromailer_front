import { Component, computed, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MailService } from '../../../services/mail.service';
import { Campaign } from '../../../core/models';

@Component({
  selector: 'app-campaigns-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './campaigns-list.component.html',

  styleUrls: ['./campaigns-list.component.css']})
export class CampaignsListComponent {
  mailSvc     = inject(MailService);
  activeFilter = signal('Toutes');
  showDelete   = signal(false);
  deleteTarget = signal<Campaign | null>(null);

  filters = ['Toutes','Brouillon','En cours','Complétée','En pause','Échouée'];

  filteredCampaigns = computed(() => {
    const f = this.activeFilter();
    const all = this.mailSvc.campaigns();
    const map: Record<string,string> = { 'Brouillon':'DRAFT','En cours':'IN_PROGRESS','Complétée':'COMPLETED','En pause':'PAUSED','Échouée':'FAILED' };
    return f === 'Toutes' ? all : all.filter(c => c.status === map[f]);
  });

  badgeClass(s: string) {
    return { 'active': s==='IN_PROGRESS', 'done': s==='COMPLETED', 'paused': s==='PAUSED', 'draft': s==='DRAFT', 'failed': s==='FAILED' };
  }

  statusLabel(s: string) {
    const m: Record<string,string> = { IN_PROGRESS:'IN PROGRESS', COMPLETED:'COMPLÉTÉE', PAUSED:'EN PAUSE', DRAFT:'BROUILLON', FAILED:'ÉCHOUÉE' };
    return m[s] ?? s;
  }

  progressColor(s: string) {
    const m: Record<string,string> = { IN_PROGRESS:'var(--color-primary)', COMPLETED:'var(--color-secondary)', PAUSED:'#f59e0b', FAILED:'var(--color-error)', DRAFT:'var(--color-surface-container-highest)' };
    return m[s] ?? 'var(--color-primary)';
  }

  openDelete(c: Campaign) { this.deleteTarget.set(c); this.showDelete.set(true); }
  confirmDelete() { if (this.deleteTarget()) { this.mailSvc.deleteCampaign(this.deleteTarget()!.id); } this.showDelete.set(false); }
}
