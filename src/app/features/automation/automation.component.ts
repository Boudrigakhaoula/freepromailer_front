import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const WORKFLOWS = [
  { id:1, name:'Série de Bienvenue', status:'Active', triggers:'Inscription', contacts:1240, openRate:'68%' },
  { id:2, name:'Relance Panier Abandonné', status:'Active', triggers:'Panier Abandonné', contacts:450, openRate:'42%' },
  { id:3, name:'Réactivation Inactifs', status:'Paused', triggers:'Inactivité > 30j', contacts:2800, openRate:'15%' },
  { id:4, name:'Anniversaire Client', status:'Active', triggers:'Date Anniversaire', contacts:890, openRate:'55%' },
  { id:5, name:'Suivi Post-Achat', status:'Draft', triggers:'Commande Terminée', contacts:0, openRate:'-' },
];

@Component({
  selector: 'app-automation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div>
  @if (!builderOpen()) {
    <div class="page-header">
      <div>
        <h2 class="page-title">Automatisations</h2>
        <p class="page-sub">Créez des parcours clients intelligents qui s'exécutent tout seuls.</p>
      </div>
      <button class="btn btn-primary" (click)="showModal.set(true)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nouveau Workflow
      </button>
    </div>

    <!-- Stats -->
    <div class="grid-3" style="margin-bottom:2rem">
      <div class="kpi-card"><div class="kpi-header"><div class="kpi-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div></div><div class="kpi-label">Automatisations Actives</div><div class="kpi-value">12</div></div>
      <div class="kpi-card"><div class="kpi-header"><div class="kpi-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div></div><div class="kpi-label">Contacts en cours</div><div class="kpi-value">4,582</div></div>
      <div class="kpi-card"><div class="kpi-header"><div class="kpi-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div></div><div class="kpi-label">Emails envoyés (auto)</div><div class="kpi-value">128.4k</div></div>
    </div>

    <!-- Workflows table -->
    <div class="card" style="overflow:hidden;margin-bottom:2rem">
      <div style="padding:1.5rem;border-bottom:1px solid rgba(195,198,215,.1)">
        <div style="position:relative;max-width:28rem">
          <svg style="position:absolute;left:.75rem;top:50%;transform:translateY(-50%);color:var(--color-on-surface-variant)" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Rechercher un workflow..." class="form-input" style="padding-left:2.5rem" />
        </div>
      </div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>Nom du Workflow</th><th>Déclencheur</th><th>Statut</th><th style="text-align:center">Contacts</th><th style="text-align:center">Ouverture</th><th style="text-align:right">Actions</th></tr></thead>
          <tbody>
            @for (w of workflows; track w.id) {
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:.75rem">
                    <div style="width:2rem;height:2rem;background:rgba(0,74,198,.1);border-radius:.375rem;display:flex;align-items:center;justify-content:center;color:var(--color-primary)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
                    </div>
                    <span style="font-weight:700;font-size:.875rem">{{w.name}}</span>
                  </div>
                </td>
                <td style="font-size:.75rem;color:var(--color-on-surface-variant)">
                  <span style="display:flex;align-items:center;gap:.5rem">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    {{w.triggers}}
                  </span>
                </td>
                <td><span class="badge" [ngClass]="{'active':w.status==='Active','paused':w.status==='Paused','draft':w.status==='Draft'}">{{w.status}}</span></td>
                <td style="text-align:center;font-weight:900;font-family:var(--font-headline)">{{w.contacts}}</td>
                <td style="text-align:center;font-weight:900;font-family:var(--font-headline);color:var(--color-secondary)">{{w.openRate}}</td>
                <td style="text-align:right">
                  <button class="btn btn-icon btn-secondary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Builder promo -->
    <div class="terminal" style="padding:2.5rem">
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:3rem">
        <div style="flex:1;min-width:240px">
          <h3 style="font-size:1.875rem;font-weight:900;font-family:var(--font-headline);color:var(--color-inverse-on-surface);margin-bottom:1rem">Éditeur Visuel de Workflow</h3>
          <p style="color:var(--color-on-surface-variant);font-size:1rem;margin-bottom:2rem">Glissez-déposez des actions, des délais et des conditions.</p>
          <div style="display:flex;gap:1rem">
            <button class="btn btn-primary" (click)="builderOpen.set(true)">Lancer l'éditeur</button>
            <button style="padding:.625rem 2rem;border-radius:.5rem;border:1px solid rgba(255,255,255,.2);background:none;color:var(--color-inverse-on-surface);font-weight:700;cursor:pointer">Voir les modèles</button>
          </div>
        </div>
        <div style="width:100%;max-width:300px;background:rgba(255,255,255,.05);backdrop-filter:blur(8px);border-radius:1rem;padding:1.5rem;border:1px solid rgba(255,255,255,.1);display:flex;flex-direction:column;gap:.75rem">
          <div style="display:flex;align-items:center;gap:1rem;padding:1rem;background:rgba(255,255,255,.1);border-radius:.75rem"><div style="width:2.5rem;height:2.5rem;background:#f59e0b;border-radius:.5rem;display:flex;align-items:center;justify-content:center;color:#fff"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div><div><p style="font-size:.75rem;font-weight:700;color:var(--color-inverse-on-surface)">DÉCLENCHEUR</p><p style="font-size:.625rem;opacity:.6;color:var(--color-inverse-on-surface)">Inscription Newsletter</p></div></div>
          <div style="text-align:center;opacity:.4"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="transform:rotate(90deg)"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
          <div style="display:flex;align-items:center;gap:1rem;padding:1rem;background:rgba(255,255,255,.1);border-radius:.75rem"><div style="width:2.5rem;height:2.5rem;background:var(--color-primary);border-radius:.5rem;display:flex;align-items:center;justify-content:center;color:#fff"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div><div><p style="font-size:.75rem;font-weight:700;color:var(--color-inverse-on-surface)">ACTION</p><p style="font-size:.625rem;opacity:.6;color:var(--color-inverse-on-surface)">Envoyer Email de Bienvenue</p></div></div>
        </div>
      </div>
    </div>
  }

  @if (builderOpen()) {
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
        <div style="display:flex;align-items:center;gap:1rem">
          <button class="btn btn-secondary" (click)="builderOpen.set(false)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <div>
            <h2 style="font-size:1.5rem;font-weight:900;font-family:var(--font-headline)">Éditeur de Workflow</h2>
            <p style="font-size:.75rem;color:var(--color-on-surface-variant)">{{newName || 'Nouveau Workflow'}}</p>
          </div>
        </div>
        <div style="display:flex;gap:.75rem">
          <button class="btn btn-ghost">Sauvegarder</button>
          <button class="btn btn-primary">Activer</button>
        </div>
      </div>

      <div style="background:var(--color-surface-container-low);border-radius:1.5rem;border:2px dashed rgba(195,198,215,.2);min-height:32rem;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden">
        <div style="position:absolute;inset:0;opacity:.03;background-image:radial-gradient(circle,currentColor 1px,transparent 1px);background-size:2rem 2rem"></div>
        <div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:1.5rem">
          <div class="card" style="width:16rem;padding:1.5rem;text-align:center;cursor:pointer">
            <div style="width:3rem;height:3rem;background:#f59e0b;border-radius:.75rem;display:flex;align-items:center;justify-content:center;color:#fff;margin:0 auto .75rem"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
            <h4 style="font-family:var(--font-headline);font-weight:700">Déclencheur</h4>
            <p style="font-size:.625rem;color:var(--color-on-surface-variant);text-transform:uppercase;letter-spacing:.1em">Inscription Newsletter</p>
          </div>
          <div style="width:1px;height:3rem;background:rgba(195,198,215,.3)"></div>
          <div class="card" style="width:16rem;padding:1rem;display:flex;align-items:center;gap:1rem;cursor:pointer">
            <div style="width:2.5rem;height:2.5rem;background:var(--color-surface-container-high);border-radius:.5rem;display:flex;align-items:center;justify-content:center;color:var(--color-on-surface-variant)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
            <div style="text-align:left"><p style="font-size:.75rem;font-weight:700">Attendre 1 jour</p><p style="font-size:.625rem;color:var(--color-on-surface-variant)">Délai de temporisation</p></div>
          </div>
          <div style="width:1px;height:3rem;background:rgba(195,198,215,.3)"></div>
          <div class="card" style="width:16rem;padding:1.5rem;text-align:center;cursor:pointer">
            <div style="width:3rem;height:3rem;background:var(--color-primary);border-radius:.75rem;display:flex;align-items:center;justify-content:center;color:#fff;margin:0 auto .75rem"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
            <h4 style="font-family:var(--font-headline);font-weight:700">Action</h4>
            <p style="font-size:.625rem;color:var(--color-on-surface-variant);text-transform:uppercase;letter-spacing:.1em">Envoyer Email de Bienvenue</p>
          </div>
          <button class="btn btn-secondary" style="border-radius:50%;width:3rem;height:3rem;padding:0;justify-content:center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      </div>
    </div>
  }

  <!-- Create modal -->
  @if (showModal()) {
    <div class="modal-overlay" (click)="showModal.set(false)">
      <div class="modal" style="max-width:28rem" (click)="$event.stopPropagation()">
        <div class="modal-header"><h3>Nouveau Workflow</h3><button class="icon-btn" (click)="showModal.set(false)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
        <div class="modal-body" style="display:flex;flex-direction:column;gap:1rem">
          <div class="form-group"><label class="form-label">Nom de l'automatisation</label><input type="text" class="form-input" [(ngModel)]="newName" placeholder="ex: Séquence de Bienvenue" /></div>
          <div class="form-group"><label class="form-label">Déclencheur</label>
            <select class="form-select" [(ngModel)]="newTrigger">
              <option>Nouvel Abonné</option><option>Panier Abandonné</option><option>Après Achat</option><option>Anniversaire</option>
            </select>
          </div>
        </div>
        <div style="display:flex;gap:.75rem;padding:1rem 1.5rem;border-top:1px solid rgba(195,198,215,.1)">
          <button class="btn btn-ghost" style="flex:1;justify-content:center" (click)="showModal.set(false)">Annuler</button>
          <button class="btn btn-primary" style="flex:1;justify-content:center" (click)="showModal.set(false);builderOpen.set(true)">Démarrer le builder</button>
        </div>
      </div>
    </div>
  }
</div>
  `
})
export class AutomationComponent {
  workflows = WORKFLOWS;
  builderOpen = signal(false);
  showModal   = signal(false);
  newName     = '';
  newTrigger  = 'Nouvel Abonné';
}
