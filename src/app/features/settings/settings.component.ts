import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<div>
  <div style="margin-bottom:2rem">
    <h2 class="page-title">Paramètres</h2>
    <p class="page-sub">Configurez votre compte et personnalisez votre expérience FreeProMailer.</p>
  </div>

  <div style="display:grid;grid-template-columns:1fr 2fr;gap:2rem;align-items:start">
    <!-- Sidebar nav -->
    <aside style="display:flex;flex-direction:column;gap:.5rem">
      @for (s of sections; track s.id) {
        <button class="setting-nav" [class.active]="active()===s.id" (click)="active.set(s.id)">
          <div class="sn-icon" [class.active]="active()===s.id">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path [attr.d]="s.iconPath"/></svg>
          </div>
          <div style="flex:1;text-align:left">
            <p style="font-size:.875rem;font-weight:700;font-family:var(--font-headline)" [style.color]="active()===s.id?'var(--color-primary)':''">{{s.label}}</p>
            <p style="font-size:.6875rem;color:var(--color-on-surface-variant)">{{s.desc}}</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [style.color]="active()===s.id?'var(--color-primary)':'var(--color-on-surface-variant)'"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      }
    </aside>

    <!-- Content -->
    <div class="card" style="padding:2rem">

      @if (active()==='profile') {
        <h3 style="font-family:var(--font-headline);font-weight:700;font-size:1.125rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:.5rem;color:var(--color-primary)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Profil Public
        </h3>
        <div style="display:flex;align-items:center;gap:1.5rem;margin-bottom:2rem">
          <div style="position:relative">
            <img src="https://picsum.photos/seed/user123/200/200" referrerpolicy="no-referrer" style="width:6rem;height:6rem;border-radius:50%;object-fit:cover;border:4px solid var(--color-surface-container)" />
          </div>
          <div>
            <p style="font-weight:700;font-size:1rem">Jean Dupont</p>
            <p style="font-size:.75rem;color:var(--color-on-surface-variant);margin-top:.25rem">jean.dupont&#64;company.io</p>
            <span style="display:inline-block;margin-top:.5rem;padding:.125rem .5rem;background:rgba(0,108,73,.1);color:var(--color-secondary);border-radius:.25rem;font-size:.625rem;font-weight:700">Compte Vérifié</span>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group"><label class="form-label">Prénom</label><input type="text" class="form-input" value="Jean" /></div>
          <div class="form-group"><label class="form-label">Nom</label><input type="text" class="form-input" value="Dupont" /></div>
          <div class="form-group" style="grid-column:1/-1"><label class="form-label">Email Professionnel</label><input type="email" class="form-input" value="jean.dupont&#64;company.io" /></div>
        </div>
      }

      @if (active()==='security') {
        <h3 style="font-family:var(--font-headline);font-weight:700;font-size:1.125rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:.5rem;color:var(--color-primary)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Sécurité du Compte
        </h3>
        <div style="padding:1.5rem;background:var(--color-surface-container-low);border-radius:.75rem;border:1px solid rgba(195,198,215,.1);display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem">
          <div><h4 style="font-size:.875rem;font-weight:700">Double Authentification (2FA)</h4><p style="font-size:.75rem;color:var(--color-on-surface-variant)">Ajoutez une couche de sécurité supplémentaire.</p></div>
          <button class="btn btn-primary btn-sm">Activer</button>
        </div>
        <h4 style="font-size:.875rem;font-weight:700;margin-bottom:1rem">Changer le mot de passe</h4>
        <div style="display:flex;flex-direction:column;gap:.75rem">
          <div class="form-group"><label class="form-label">Mot de passe actuel</label><input type="password" class="form-input" placeholder="••••••••" /></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="form-group"><label class="form-label">Nouveau</label><input type="password" class="form-input" placeholder="••••••••" /></div>
            <div class="form-group"><label class="form-label">Confirmer</label><input type="password" class="form-input" placeholder="••••••••" /></div>
          </div>
          <button class="btn btn-secondary" style="align-self:flex-start">Mettre à jour</button>
        </div>
      }

      @if (active()==='smtp') {
        <h3 style="font-family:var(--font-headline);font-weight:700;font-size:1.125rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:.5rem;color:var(--color-primary)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          Configuration SMTP
        </h3>
        <div style="background:var(--color-surface-container-low);border-radius:.75rem;padding:1.5rem;display:flex;flex-direction:column;gap:1rem">
          <div style="display:grid;grid-template-columns:2fr 1fr;gap:1rem">
            <div class="form-group"><label class="form-label">Serveur SMTP</label><input type="text" class="form-input" value="smtp.freepromailer.io" /></div>
            <div class="form-group"><label class="form-label">Port</label><input type="text" class="form-input" value="587" /></div>
          </div>
          <div class="form-group"><label class="form-label">Domaine vérifié</label>
            <div style="display:flex;align-items:center;justify-content:space-between;padding:.75rem;background:rgba(0,108,73,.05);border:1px solid rgba(0,108,73,.2);border-radius:.5rem">
              <span style="font-size:.875rem;font-weight:500;color:var(--color-secondary)">mg.company.io</span>
              <span style="font-size:.625rem;font-weight:900;color:var(--color-secondary);text-transform:uppercase">✓ Vérifié</span>
            </div>
          </div>
          <button class="btn btn-secondary" style="justify-content:center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.28-4.73L23 4"/></svg>
            Tester la connexion SMTP
          </button>
        </div>
      }

      @if (active()==='api') {
        <h3 style="font-family:var(--font-headline);font-weight:700;font-size:1.125rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:.5rem;color:var(--color-primary)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
          Clés API
        </h3>
        <div style="display:flex;flex-direction:column;gap:.75rem">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:1rem;background:var(--color-surface-container-low);border-radius:.75rem;border:1px solid rgba(195,198,215,.1)">
            <div><p style="font-size:.875rem;font-weight:700">Production Key</p><p style="font-size:.75rem;font-family:var(--font-technical);color:var(--color-on-surface-variant)">fpm_live_••••••••••••••••</p></div>
            <button class="btn btn-secondary btn-sm">Régénérer</button>
          </div>
          <button class="btn btn-ghost" style="justify-content:center;border:2px dashed rgba(195,198,215,.3)">+ Générer une nouvelle clé</button>
        </div>
      }

      @if (active()==='billing') {
        <h3 style="font-family:var(--font-headline);font-weight:700;font-size:1.125rem;margin-bottom:1.5rem;display:flex;align-items:center;gap:.5rem;color:var(--color-primary)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          Facturation
        </h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:2rem">
          <div style="padding:1.5rem;background:rgba(0,74,198,.05);border:1px solid rgba(0,74,198,.2);border-radius:1rem">
            <span style="font-size:.625rem;font-weight:900;text-transform:uppercase;background:var(--color-primary);color:#fff;padding:.125rem .5rem;border-radius:.25rem">Plan Actuel</span>
            <h4 style="font-size:1.5rem;font-weight:900;font-family:var(--font-headline);margin:.75rem 0 .25rem">Pro Plan</h4>
            <p style="font-size:.75rem;color:var(--color-on-surface-variant)">29€ / mois • 10,000 contacts</p>
            <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:1rem">Gérer l'abonnement</button>
          </div>
          <div style="padding:1.5rem;background:var(--color-surface-container-low);border-radius:1rem">
            <h4 style="font-size:.875rem;font-weight:700;margin-bottom:.75rem">Méthode de Paiement</h4>
            <div style="display:flex;align-items:center;gap:.75rem">
              <div style="width:2.5rem;height:1.5rem;background:var(--color-surface-container-highest);border-radius:.25rem;display:flex;align-items:center;justify-content:center;font-size:.625rem;font-weight:700">VISA</div>
              <span style="font-size:.875rem">•••• 4242</span>
            </div>
          </div>
        </div>
        <h4 style="font-size:.875rem;font-weight:700;margin-bottom:.75rem">Historique des Factures</h4>
        @for (inv of invoices; track inv.id) {
          <a [routerLink]="['/orders', inv.id]" style="display:flex;align-items:center;justify-content:space-between;padding:.75rem;background:var(--color-surface-container-low);border-radius:.5rem;margin-bottom:.5rem;text-decoration:none;color:inherit;transition:background .15s" onmouseenter="this.style.background='var(--color-surface-container)'" onmouseleave="this.style.background='var(--color-surface-container-low)'">
            <span style="font-size:.75rem;font-weight:500">{{inv.date}}</span>
            <div style="display:flex;align-items:center;gap:1rem">
              <span style="font-size:.75rem;font-weight:700">{{inv.amount}}</span>
              <span style="font-size:.625rem;font-weight:700;text-transform:uppercase;color:var(--color-secondary)">{{inv.status}}</span>
              <span style="font-size:.75rem;font-weight:700;color:var(--color-primary)">PDF</span>
            </div>
          </a>
        }
      }

      <div style="padding-top:1.5rem;margin-top:1.5rem;border-top:1px solid rgba(195,198,215,.1);display:flex;justify-content:flex-end;gap:1rem">
        <button class="btn btn-ghost">Annuler</button>
        <button class="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          Sauvegarder
        </button>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
    .setting-nav { display:flex;align-items:center;gap:1rem;padding:1rem;border-radius:.75rem;border:1px solid transparent;background:none;cursor:pointer;width:100%;transition:all .2s;
      &:hover { background:var(--color-surface-container-low); }
      &.active { background:rgba(0,74,198,.1);border-color:rgba(0,74,198,.2); }
    }
    .sn-icon { width:2.5rem;height:2.5rem;border-radius:.5rem;background:var(--color-surface-container-high);color:var(--color-on-surface-variant);display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s;flex-shrink:0;
      &.active { background:var(--color-primary);color:#fff; }
    }
  `]
})
export class SettingsComponent {
  active = signal('profile');

  sections = [
    { id:'profile',  label:'Profil & Compte',    desc:'Informations personnelles',     iconPath:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
    { id:'security', label:'Sécurité',            desc:'Mot de passe et 2FA',           iconPath:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { id:'smtp',     label:'Configuration SMTP',  desc:"Serveurs d'envoi",              iconPath:'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6' },
    { id:'notif',    label:'Notifications',        desc:'Alertes et rapports',           iconPath:'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0' },
    { id:'api',      label:'Clés API',             desc:'Intégrations développeurs',     iconPath:'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4' },
    { id:'billing',  label:'Facturation',          desc:'Abonnement et factures',        iconPath:'M1 4h22v16H1zM1 10h22' },
  ];

  invoices = [
    { id:'INV-2024-001', date:'01 Mars 2024',   amount:'29.00€', status:'Payée' },
    { id:'INV-2024-002', date:'01 Fév 2024',    amount:'29.00€', status:'Payée' },
    { id:'INV-2024-003', date:'01 Jan 2024',    amount:'29.00€', status:'Payée' },
  ];
}
