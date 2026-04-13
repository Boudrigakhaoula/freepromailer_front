import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MailService } from '../../core/services/mail.service';
import { Template } from '../../models';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div>
  <div class="page-header">
    <div>
      <h2 class="page-title">Email Templates</h2>
      <p class="page-sub">Créez des designs percutants avec notre éditeur ou utilisez nos modèles pré-conçus.</p>
    </div>
    <button class="btn btn-primary" (click)="showCreate.set(true)">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Nouveau Modèle
    </button>
  </div>

  <!-- Filters -->
  <div style="display:flex;align-items:center;justify-content:space-between;background:var(--color-surface-container-lowest);padding:1rem;border-radius:.75rem;border:1px solid rgba(195,198,215,.1);margin-bottom:2rem;flex-wrap:wrap;gap:1rem">
    <div style="display:flex;gap:.5rem;overflow-x:auto">
      @for (f of cats; track f) {
        <button class="filter-pill" [class.active]="cat()===f" [class.inactive]="cat()!==f" (click)="cat.set(f)">{{f}}</button>
      }
    </div>
    <div style="position:relative">
      <svg style="position:absolute;left:.75rem;top:50%;transform:translateY(-50%);color:var(--color-on-surface-variant)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" placeholder="Rechercher..." class="form-input" style="padding-left:2.25rem;width:16rem" />
    </div>
  </div>

  <!-- Grid -->
  <div class="grid-3">
    @for (t of mailSvc.templates(); track t.id) {
      <div class="card" style="overflow:hidden;transition:transform .3s,box-shadow .3s;cursor:pointer" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,.1)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
        <div style="position:relative;overflow:hidden;aspect-ratio:4/3;background:var(--color-surface-container)">
          <img [src]="t.image" [alt]="t.name" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;transition:transform .5s" onmouseenter="this.style.transform='scale(1.1)'" onmouseleave="this.style.transform=''" />
          <div style="position:absolute;top:1rem;left:1rem">
            <span style="padding:.25rem .5rem;background:rgba(255,255,255,.9);backdrop-filter:blur(4px);border-radius:.25rem;font-size:.625rem;font-weight:900;text-transform:uppercase;letter-spacing:.05em;color:var(--color-primary)">{{t.category}}</span>
          </div>
          <div class="tpl-overlay" style="position:absolute;inset:0;background:rgba(0,74,198,.4);display:flex;align-items:center;justify-content:center;gap:.75rem;opacity:0;transition:opacity .2s;backdrop-filter:blur(2px)" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0'">
            <button (click)="preview(t)" style="width:2.5rem;height:2.5rem;border-radius:50%;background:#fff;color:var(--color-primary);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s" onmouseenter="this.style.transform='scale(1.1)'" onmouseleave="this.style.transform=''">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>
        <div style="padding:1.5rem">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.25rem">
            <h3 style="font-family:var(--font-headline);font-weight:700">{{t.name}}</h3>
            <button class="icon-btn" (click)="delTarget.set(t);showDel.set(true)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
          </div>
          <p style="font-size:.6875rem;color:var(--color-on-surface-variant);margin-bottom:1.5rem">Dernière utilisation : {{t.lastUsed}}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:1rem;border-top:1px solid rgba(195,198,215,.1)">
            <div style="display:flex;gap:.5rem;color:var(--color-on-surface-variant)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Create new card -->
    <button (click)="showCreate.set(true)" style="border:2px dashed rgba(195,198,215,.3);border-radius:.75rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:2rem;cursor:pointer;background:none;transition:all .2s;min-height:200px" onmouseenter="this.style.borderColor='rgba(0,74,198,.4)';this.style.background='rgba(0,74,198,.05)'" onmouseleave="this.style.borderColor='rgba(195,198,215,.3)';this.style.background='none'">
      <div style="width:4rem;height:4rem;border-radius:50%;background:var(--color-surface-container);display:flex;align-items:center;justify-content:center;color:var(--color-on-surface-variant)">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </div>
      <div style="text-align:center">
        <p style="font-family:var(--font-headline);font-weight:700;color:var(--color-on-surface)">Nouveau Modèle</p>
        <p style="font-size:.75rem;color:var(--color-on-surface-variant)">Partir d'une page blanche</p>
      </div>
    </button>
  </div>

  <!-- AI promo banner -->
  <div style="background:linear-gradient(135deg,var(--color-primary),var(--color-primary-container));border-radius:1rem;padding:2rem;margin-top:2rem;display:flex;align-items:center;gap:2rem;box-shadow:0 8px 24px rgba(0,74,198,.25);flex-wrap:wrap">
    <div style="width:5rem;height:5rem;border-radius:1rem;background:rgba(255,255,255,.2);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    </div>
    <div style="flex:1">
      <h3 style="font-size:1.5rem;font-weight:900;font-family:var(--font-headline);color:#fff;margin-bottom:.5rem">Générez vos designs avec l'IA</h3>
      <p style="color:rgba(255,255,255,.8);font-weight:500">Décrivez votre campagne et laissez Gemini créer une structure d'email optimisée.</p>
    </div>
    <button style="background:#fff;color:var(--color-primary);border:none;border-radius:.75rem;padding:.75rem 2rem;font-weight:900;font-size:.875rem;cursor:pointer;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,.12)">Essayer le Générateur</button>
  </div>

  <!-- Preview modal -->
  @if (showPreview() && previewTarget()) {
    <div class="modal-overlay" (click)="showPreview.set(false)">
      <div class="modal" style="max-width:56rem;max-height:80vh;display:flex;flex-direction:column" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{previewTarget()!.name}}</h3>
          <button class="icon-btn" (click)="showPreview.set(false)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div style="flex:1;overflow-y:auto;background:var(--color-surface-container);padding:2rem">
          <div style="max-width:40rem;margin:0 auto;background:#fff;border-radius:.5rem;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)">
            <img [src]="previewTarget()!.image" alt="preview" referrerpolicy="no-referrer" style="width:100%;height:10rem;object-fit:cover" />
            <div style="padding:2.5rem">
              <h1 style="font-size:1.875rem;font-weight:900;color:#111;margin-bottom:1rem">Bonjour de FreeProMailer !</h1>
              <p style="color:#666;line-height:1.7;margin-bottom:2rem">Ceci est une prévisualisation du modèle <strong>{{previewTarget()!.name}}</strong>.</p>
              <button style="background:#2563eb;color:#fff;padding:.75rem 2rem;border-radius:.5rem;border:none;font-weight:700;cursor:pointer">Action Principale</button>
              <p style="color:#aaa;font-size:.75rem;text-align:center;margin-top:2rem">© 2024 FreeProMailer. Tous droits réservés.</p>
            </div>
          </div>
        </div>
        <div style="padding:1rem 1.5rem;border-top:1px solid rgba(195,198,215,.1);display:flex;justify-content:flex-end;gap:.75rem">
          <button class="btn btn-ghost" (click)="showPreview.set(false)">Fermer</button>
          <button class="btn btn-primary">Utiliser ce modèle</button>
        </div>
      </div>
    </div>
  }

  <!-- Create modal -->
  @if (showCreate()) {
    <div class="modal-overlay" (click)="showCreate.set(false)">
      <div class="modal" style="max-width:28rem" (click)="$event.stopPropagation()">
        <div class="modal-header"><h3>Nouveau Modèle</h3><button class="icon-btn" (click)="showCreate.set(false)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>
        <div class="modal-body" style="display:flex;flex-direction:column;gap:1rem">
          <div class="form-group"><label class="form-label">Nom du modèle</label><input type="text" class="form-input" [(ngModel)]="newName" placeholder="ex: Newsletter Printemps" /></div>
          <div class="form-group"><label class="form-label">Catégorie</label>
            <select class="form-select" [(ngModel)]="newCat">
              <option *ngFor="let c of catOptions">{{c}}</option>
            </select>
          </div>
        </div>
        <div style="display:flex;gap:.75rem;padding:1rem 1.5rem;border-top:1px solid rgba(195,198,215,.1)">
          <button class="btn btn-ghost" style="flex:1;justify-content:center" (click)="showCreate.set(false)">Annuler</button>
          <button class="btn btn-primary" style="flex:1;justify-content:center" (click)="showCreate.set(false)">Créer le modèle</button>
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
          <h4 style="font-family:var(--font-headline);font-weight:700;font-size:1.125rem;margin-bottom:.5rem">Supprimer le modèle ?</h4>
          <p style="font-size:.875rem;color:var(--color-on-surface-variant)">Voulez-vous supprimer <strong>{{delTarget()?.name}}</strong> ?</p>
          <div style="display:flex;gap:.75rem;margin-top:1.5rem">
            <button class="btn btn-ghost" style="flex:1;justify-content:center" (click)="showDel.set(false)">Annuler</button>
            <button class="btn btn-danger" style="flex:1;justify-content:center" (click)="confirmDel()">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  }
</div>
  `
})
export class TemplatesComponent {
  mailSvc     = inject(MailService);
  cat         = signal('Tous');
  showPreview = signal(false);
  showCreate  = signal(false);
  showDel     = signal(false);
  previewTarget = signal<Template | null>(null);
  delTarget   = signal<Template | null>(null);
  newName = ''; newCat = 'Marketing';
  cats = ['Tous','Marketing','Transactionnel','Automatisé'];
  catOptions = ['Marketing','Onboarding','E-commerce','Product','Event','Transactional'];

  preview(t: Template) { this.previewTarget.set(t); this.showPreview.set(true); }
  confirmDel() { if (this.delTarget()) this.mailSvc.deleteTemplate(this.delTarget()!.id); this.showDel.set(false); }
}
