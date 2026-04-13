import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MailService } from '../../core/services/mail.service';
import { Contact } from '../../models';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div>
  <div class="page-header">
    <div>
      <h2 class="page-title">Audience & Contacts</h2>
      <p class="page-sub">Gérez vos listes de diffusion et segmentez vos contacts.</p>
    </div>
    <div style="display:flex;gap:.75rem">
      <button class="btn btn-secondary" (click)="showImport.set(true)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
        Importer
      </button>
      <button class="btn btn-primary" (click)="openCreate()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
        Nouveau Contact
      </button>
    </div>
  </div>

  <!-- Stats -->
  <div class="grid-3" style="margin-bottom:2rem">
    <div class="card" style="padding:1.5rem">
      <div style="font-size:.625rem;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:var(--color-on-surface-variant);margin-bottom:.25rem">Total Contacts</div>
      <div style="font-size:1.875rem;font-weight:900;font-family:var(--font-headline)">12,402</div>
      <div style="font-size:.625rem;font-weight:700;color:var(--color-secondary);margin-top:1rem">↑ +124 ce mois</div>
    </div>
    <div class="card" style="padding:1.5rem">
      <div style="font-size:.625rem;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:var(--color-on-surface-variant);margin-bottom:.25rem">Taux d'Abonnement</div>
      <div style="font-size:1.875rem;font-weight:900;font-family:var(--font-headline)">94.2%</div>
      <div class="prog-track" style="margin-top:1rem"><div class="prog-fill" style="width:94.2%;background:var(--color-secondary)"></div></div>
    </div>
    <div class="card" style="padding:1.5rem">
      <div style="font-size:.625rem;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:var(--color-on-surface-variant);margin-bottom:.25rem">Segments Actifs</div>
      <div style="font-size:1.875rem;font-weight:900;font-family:var(--font-headline)">18</div>
      <div style="display:flex;gap:.5rem;margin-top:1rem">
        <span class="tag" style="background:rgba(0,74,198,.1);color:var(--color-primary)">VIP</span>
        <span class="tag" style="background:rgba(0,74,198,.1);color:var(--color-primary)">SaaS</span>
        <span class="tag" style="background:rgba(0,74,198,.1);color:var(--color-primary)">Leads</span>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="card" style="overflow:hidden">
    <div style="padding:1.5rem;border-bottom:1px solid rgba(195,198,215,.1);display:flex;align-items:center;justify-content:space-between">
      <div style="position:relative;flex:1;max-width:28rem">
        <svg style="position:absolute;left:.75rem;top:50%;transform:translateY(-50%);color:var(--color-on-surface-variant)" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Rechercher par nom, email ou tag..." class="form-input" style="padding-left:2.5rem" />
      </div>
      <div style="display:flex;gap:.5rem">
        <button class="btn btn-secondary btn-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        </button>
        <button class="btn btn-secondary btn-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
      </div>
    </div>

    <div style="overflow-x:auto">
      <table class="data-table">
        <thead><tr>
          <th>Contact</th><th>Statut</th><th>Tags</th><th>Date d'ajout</th><th style="text-align:right">Actions</th>
        </tr></thead>
        <tbody>
          @for (c of mailSvc.contacts(); track c.id) {
            <tr>
              <td>
                <div style="display:flex;align-items:center;gap:.75rem">
                  <div style="width:2rem;height:2rem;border-radius:50%;background:rgba(0,74,198,.1);display:flex;align-items:center;justify-content:center;color:var(--color-primary);font-weight:700;font-size:.75rem">{{c.name.charAt(0)}}</div>
                  <div>
                    <div style="font-weight:700;font-size:.875rem">{{c.name}}</div>
                    <div style="font-size:.6875rem;color:var(--color-on-surface-variant)">{{c.email}}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge" [ngClass]="statusClass(c.status)">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <ng-container *ngIf="c.status==='Subscribed'"><polyline points="20 6 9 17 4 12"/></ng-container>
                    <ng-container *ngIf="c.status==='Unsubscribed'"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></ng-container>
                    <ng-container *ngIf="c.status==='Pending'"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></ng-container>
                  </svg>
                  {{statusLabel(c.status)}}
                </span>
              </td>
              <td>
                <div style="display:flex;gap:.25rem;flex-wrap:wrap">
                  @for (t of c.tags; track t) { <span class="tag">{{t}}</span> }
                </div>
              </td>
              <td style="font-size:.75rem;color:var(--color-on-surface-variant)">{{c.date}}</td>
              <td style="text-align:right">
                <div style="display:flex;justify-content:flex-end;gap:.5rem">
                  <button class="btn btn-icon btn-secondary" (click)="openEdit(c)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  </button>
                  <button class="btn btn-icon" style="background:none;color:var(--color-on-surface-variant);border:none;cursor:pointer;padding:.5rem;border-radius:.375rem;transition:color .15s" (click)="openDel(c)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <div style="padding:1rem 1.5rem;background:var(--color-surface-container-low);border-top:1px solid rgba(195,198,215,.1);display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:.75rem;color:var(--color-on-surface-variant)">Affichage de 1–{{mailSvc.contacts().length}} sur 12,402 contacts</span>
      <div style="display:flex;gap:.5rem">
        <button class="btn btn-ghost btn-sm" disabled>Précédent</button>
        <button class="btn btn-primary btn-sm">1</button>
        <button class="btn btn-ghost btn-sm">2</button>
        <button class="btn btn-ghost btn-sm">Suivant</button>
      </div>
    </div>
  </div>

  <!-- Add/Edit Modal -->
  @if (showForm()) {
    <div class="modal-overlay" (click)="showForm.set(false)">
      <div class="modal" style="max-width:32rem" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{editTarget() ? 'Modifier le Contact' : 'Nouveau Contact'}}</h3>
          <button class="icon-btn" (click)="showForm.set(false)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body" style="display:flex;flex-direction:column;gap:1rem">
          <div class="form-group"><label class="form-label">Nom complet</label><input type="text" class="form-input" [(ngModel)]="form.name" placeholder="Jean Dupont" /></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" [(ngModel)]="form.email" placeholder="jean@exemple.com" /></div>
            <div class="form-group"><label class="form-label">Téléphone</label><input type="tel" class="form-input" [(ngModel)]="form.phone" placeholder="+33 6 00 00 00 00" /></div>
          </div>
          <div class="form-group"><label class="form-label">Statut</label>
            <select class="form-select" [(ngModel)]="form.status">
              <option value="Subscribed">Abonné</option>
              <option value="Unsubscribed">Désabonné</option>
              <option value="Pending">En attente</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Tags (séparés par virgule)</label><input type="text" class="form-input" [(ngModel)]="form.tags" placeholder="VIP, SaaS, Lead..." /></div>
        </div>
        <div style="display:flex;gap:.75rem;padding:1rem 1.5rem;border-top:1px solid rgba(195,198,215,.1)">
          <button class="btn btn-ghost" style="flex:1;justify-content:center" (click)="showForm.set(false)">Annuler</button>
          <button class="btn btn-primary" style="flex:1;justify-content:center" (click)="saveContact()">{{editTarget() ? 'Enregistrer' : 'Créer le contact'}}</button>
        </div>
      </div>
    </div>
  }

  <!-- Delete modal -->
  @if (showDel()) {
    <div class="modal-overlay" (click)="showDel.set(false)">
      <div class="modal" style="max-width:22rem" (click)="$event.stopPropagation()">
        <div style="padding:2rem;text-align:center">
          <div style="width:4rem;height:4rem;background:rgba(186,26,26,.1);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;color:var(--color-error)">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </div>
          <h4 style="font-family:var(--font-headline);font-weight:700;font-size:1.125rem;margin-bottom:.5rem">Supprimer le contact ?</h4>
          <p style="font-size:.875rem;color:var(--color-on-surface-variant)">Cette action est irréversible. <strong>{{delTarget()?.name}}</strong> sera supprimé(e).</p>
          <div style="display:flex;gap:.75rem;margin-top:1.5rem">
            <button class="btn btn-ghost" style="flex:1;justify-content:center" (click)="showDel.set(false)">Annuler</button>
            <button class="btn btn-danger" style="flex:1;justify-content:center" (click)="confirmDel()">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  }

  <!-- Import modal -->
  @if (showImport()) {
    <div class="modal-overlay" (click)="showImport.set(false)">
      <div class="modal" style="max-width:32rem" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Importer des Contacts</h3>
          <button class="icon-btn" (click)="showImport.set(false)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div class="modal-body" style="text-align:center">
          <div style="width:5rem;height:5rem;background:rgba(0,74,198,.1);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;color:var(--color-primary)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
          </div>
          <h4 style="font-family:var(--font-headline);font-weight:700;font-size:1.125rem;margin-bottom:.5rem">Glissez votre fichier CSV ou Excel</h4>
          <p style="font-size:.875rem;color:var(--color-on-surface-variant)">Formats supportés : .csv, .xlsx, .txt. Max : 10 MB.</p>
          <div style="border:2px dashed rgba(195,198,215,.3);border-radius:1rem;padding:2.5rem;margin:1.5rem 0;cursor:pointer;transition:all .15s" onmouseenter="this.style.borderColor='rgba(0,74,198,.4)'" onmouseleave="this.style.borderColor='rgba(195,198,215,.3)'">
            <p style="font-size:.75rem;font-weight:700;color:var(--color-on-surface-variant)">Cliquez pour parcourir vos fichiers</p>
          </div>
        </div>
        <div style="display:flex;gap:.75rem;padding:1rem 1.5rem;border-top:1px solid rgba(195,198,215,.1)">
          <button class="btn btn-ghost" style="flex:1;justify-content:center" (click)="showImport.set(false)">Annuler</button>
          <button class="btn btn-primary" style="flex:1;justify-content:center">Lancer l'import</button>
        </div>
      </div>
    </div>
  }
</div>
  `
})
export class ContactsComponent {
  mailSvc    = inject(MailService);
  showForm   = signal(false);
  showDel    = signal(false);
  showImport = signal(false);
  editTarget = signal<Contact | null>(null);
  delTarget  = signal<Contact | null>(null);

  form = { name: '', email: '', phone: '', status: 'Subscribed', tags: '' };

  statusLabel(s: string) { return s === 'Subscribed' ? 'ABONNÉ' : s === 'Unsubscribed' ? 'DÉSABONNÉ' : 'EN ATTENTE'; }
  statusClass(s: string) { return { 'sub': s === 'Subscribed', 'unsub': s === 'Unsubscribed', 'pending': s === 'Pending' }; }

  openCreate() { this.editTarget.set(null); this.form = { name:'',email:'',phone:'',status:'Subscribed',tags:'' }; this.showForm.set(true); }
  openEdit(c: Contact) {
    this.editTarget.set(c);
    this.form = { name: c.name, email: c.email, phone: c.phone||'', status: c.status, tags: c.tags.join(', ') };
    this.showForm.set(true);
  }
  openDel(c: Contact) { this.delTarget.set(c); this.showDel.set(true); }

  saveContact() {
    if (!this.editTarget()) {
      this.mailSvc.addContact({ name: this.form.name, email: this.form.email, phone: this.form.phone, status: this.form.status as any, tags: this.form.tags.split(',').map(t=>t.trim()).filter(Boolean), date: new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'}) });
    }
    this.showForm.set(false);
  }

  confirmDel() { if (this.delTarget()) this.mailSvc.deleteContact(this.delTarget()!.id); this.showDel.set(false); }
}
