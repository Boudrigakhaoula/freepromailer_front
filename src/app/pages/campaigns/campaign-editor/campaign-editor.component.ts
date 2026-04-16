import { Component, OnInit, signal, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MailService } from '../../../services/mail.service';
import { ContactService } from '../../../core/services/contact.service';
import { CampaignApiService } from '../../../core/services/campaign-api.service';
import { ContactList } from '../../../core/models/contact.models';
import { Template } from '../../../services/mail.service';
import { Campaign } from '../../../core/models/campaign.models';

const STEPS = ['1. Infos générales', '2. Contenu', '3. Destinataires', '4. Planification'];

@Component({
  selector: 'app-campaign-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaign-editor.component.html',
  styleUrls: ['./campaign-editor.component.css'],
})
export class CampaignEditorComponent implements OnInit {
  private readonly mailService    = inject(MailService);
  private readonly contactService = inject(ContactService);
  private readonly campaignApi    = inject(CampaignApiService);
  private readonly router         = inject(Router);
  private readonly route          = inject(ActivatedRoute);

  // ── Mode édition (si on arrive avec un id) ────────────────────────────────

  editId = signal<number | null>(null);
  isEditMode = signal(false);

  // ── Stepper ───────────────────────────────────────────────────────────────

  step = signal(1);
  steps = STEPS;
  stepLabel() { return STEPS[this.step() - 1].split('. ')[1]; }

  // ── Champs formulaire ─────────────────────────────────────────────────────

  campaignName  = '';
  sender        = 'marketing@freepromailer.io';
  subject       = '';
  bodyContent   = '';

  // ── Templates & listes ────────────────────────────────────────────────────

  templates       = this.mailService.templates;
  selectedTemplateId = signal<number | null>(null);
  generatedTemplateName = signal<string | null>(null);
  showTemplatePrompt    = signal(false);
  templatePrompt        = signal('');

  contactLists          = signal<ContactList[]>([]);
  selectedContactListId = signal<number | null>(null);

  // ── Pièces jointes ────────────────────────────────────────────────────────

  attachments = signal<File[]>([]);
  attachmentCount() { return this.attachments().length; }

  // ── Planification ─────────────────────────────────────────────────────────

  scheduleMode  = signal<'now' | 'schedule'>('now');
  scheduledDate = signal('');
  scheduledTime = signal('');

  // ── IA ────────────────────────────────────────────────────────────────────

  generating    = signal(false);
  aiSuggestions = signal<string[]>([]);

  // ── État soumission ───────────────────────────────────────────────────────

  saving        = signal(false);
  starting      = signal(false);
  errorMsg      = signal<string | null>(null);
  savedCampaignId = signal<number | null>(null);

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.mailService.loadTemplates();

    // Charger les listes de contacts
    this.contactService.getAllLists().subscribe({
      next: lists => {
        this.contactLists.set(lists);
        if (lists.length > 0 && this.selectedContactListId() === null) {
          this.selectedContactListId.set(lists[0].id);
        }
      },
    });

    // Mode édition : charger la campagne existante
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const numId = Number(id);
      this.editId.set(numId);
      this.isEditMode.set(true);
      this.campaignApi.getCampaignById(numId).subscribe({
        next: c => this.patchFromCampaign(c),
        error: () => this.router.navigate(['/campaigns']),
      });
    }
  }

  private patchFromCampaign(c: Campaign): void {
    this.campaignName  = c.name ?? '';
    this.sender        = c.sender ?? 'marketing@freepromailer.io';
    this.subject       = c.subject ?? '';
    this.bodyContent   = c.body ?? '';
    if (c.contactListId)  this.selectedContactListId.set(c.contactListId);
    if (c.templateId)     this.selectedTemplateId.set(c.templateId);
    if (c.scheduledAt) {
      const dt = new Date(c.scheduledAt);
      this.scheduleMode.set('schedule');
      this.scheduledDate.set(dt.toISOString().slice(0, 10));
      this.scheduledTime.set(dt.toISOString().slice(11, 16));
    }
  }

  // ── Navigation stepper ────────────────────────────────────────────────────

  next() {
    if (this.step() < 4) {
      this.step.update(v => v + 1);
    }
  }

  prev() {
    if (this.step() > 1) {
      this.step.update(v => v - 1);
    } else {
      this.router.navigate(['/campaigns']);
    }
  }

  // ── Résumé étape 4 ────────────────────────────────────────────────────────

  selectedTemplateName() {
    return this.templates().find(t => t.id === this.selectedTemplateId())?.name ?? 'Aucun template';
  }

  selectedContactListName() {
    return this.contactLists().find(l => l.id === this.selectedContactListId())?.name ?? 'Aucune';
  }

  sendModeLabel() {
    return this.scheduleMode() === 'now' ? 'Envoi immédiat' : 'Envoi planifié';
  }

  plannedAtLabel() {
    if (this.scheduleMode() !== 'schedule') return 'Maintenant';
    const d = this.scheduledDate();
    const t = this.scheduledTime();
    if (!d && !t) return 'Non défini';
    return d && t ? `${d} ${t}` : d || t;
  }

  private buildScheduledAt(): string | null {
    if (this.scheduleMode() !== 'schedule') return null;
    const d = this.scheduledDate();
    const t = this.scheduledTime();
    if (!d || !t) return null;
    return `${d}T${t}:00`;
  }

  // ── Save (brouillon) ──────────────────────────────────────────────────────

  savePlan(): void {
    this.errorMsg.set(null);
    this.saving.set(true);

    const payload = {
      name:          this.campaignName || 'Sans nom',
      subject:       this.subject || 'Sans objet',
      sender:        this.sender,
      body:          this.bodyContent,
      contactListId: this.selectedContactListId(),
      templateId:    this.selectedTemplateId(),
      scheduledAt:   this.buildScheduledAt(),
      attachments:   this.attachments(),
    };

    const obs$ = this.isEditMode() && this.editId()
      ? this.campaignApi.updateCampaign(this.editId()!, payload)
      : this.campaignApi.createCampaign(payload);

    obs$.subscribe({
      next: campaign => {
        this.savedCampaignId.set(campaign.id);
        this.saving.set(false);
        this.mailService.loadCampaigns();
        this.router.navigate(['/campaigns']);
      },
      error: err => {
        this.errorMsg.set(err?.error?.message ?? 'Erreur lors de la sauvegarde');
        this.saving.set(false);
      },
    });
  }

  // ── Start (créer puis lancer immédiatement) ────────────────────────────────

  startCampaign(): void {
    this.errorMsg.set(null);
    this.starting.set(true);

    const payload = {
      name:          this.campaignName || 'Sans nom',
      subject:       this.subject || 'Sans objet',
      sender:        this.sender,
      body:          this.bodyContent,
      contactListId: this.selectedContactListId(),
      templateId:    this.selectedTemplateId(),
      scheduledAt:   this.buildScheduledAt(),
      attachments:   this.attachments(),
    };

    // Si mode édition, mettre à jour d'abord, sinon créer
    const create$ = this.isEditMode() && this.editId()
      ? this.campaignApi.updateCampaign(this.editId()!, payload)
      : this.campaignApi.createCampaign(payload);

    create$.subscribe({
      next: campaign => {
        // Lancer immédiatement
        this.campaignApi.startCampaign(campaign.id).subscribe({
          next: () => {
            this.starting.set(false);
            this.mailService.loadCampaigns();
            this.router.navigate(['/campaigns']);
          },
          error: err => {
            // Campagne créée mais pas lancée → retourner à la liste
            this.starting.set(false);
            this.errorMsg.set(err?.error?.message ?? 'Campagne créée mais impossible de la lancer');
            this.mailService.loadCampaigns();
            setTimeout(() => this.router.navigate(['/campaigns']), 2000);
          },
        });
      },
      error: err => {
        this.errorMsg.set(err?.error?.message ?? 'Erreur lors de la création');
        this.starting.set(false);
      },
    });
  }

  // ── IA ────────────────────────────────────────────────────────────────────

  generateAI(): void {
    this.generating.set(true);
    setTimeout(() => {
      this.aiSuggestions.set([
        'Boostez vos ventes dès maintenant !',
        'Une surprise vous attend...',
        'Ne manquez pas cette offre !',
      ]);
      this.generating.set(false);
    }, 800);
  }

  generateTemplate(): void {
    this.showTemplatePrompt.set(true);
  }

  confirmGenerateTemplate(): void {
    const available = this.templates();
    if (available.length === 0) {
      this.generatedTemplateName.set('Aucun template disponible');
      this.selectedTemplateId.set(null);
      return;
    }
    const t = available[0];
    this.selectedTemplateId.set(t.id);
    const prompt = this.templatePrompt().trim();
    this.generatedTemplateName.set(prompt ? `${t.name} • ${prompt}` : t.name);
    this.showTemplatePrompt.set(false);
  }

  // ── Pièces jointes ────────────────────────────────────────────────────────

  onAttachmentsSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (!files.length) return;
    this.attachments.update(curr => {
      const merged = [...curr, ...files];
      return merged.filter((f, i, self) =>
        self.findIndex(x => x.name === f.name && x.size === f.size && x.lastModified === f.lastModified) === i
      );
    });
    input.value = '';
  }

  removeAttachment(index: number): void {
    this.attachments.update(curr => curr.filter((_, i) => i !== index));
  }

  clearAttachments(): void {
    this.attachments.set([]);
  }
}