import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MailService } from '../../../services/mail.service';
import { ContactService } from '../../../core/services/contact.service';
import { ContactList } from '../../../core/models/contact.models';
import { Template } from '../../../core/models';

const STEPS = ['1. Infos générales','2. Contenu','3. Destinataires','4. Planification'];

@Component({
  selector: 'app-campaign-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaign-editor.component.html',
  styleUrls: ['./campaign-editor.component.css'],
})
export class CampaignEditorComponent {
  private readonly mailService = inject(MailService);
  private readonly contactService = inject(ContactService);

  step = signal(1);
  campaignName = 'Ma Super Campagne';
  sender = 'marketing@freepromailer.io';
  subject = 'Découvrez nos nouveautés...';
  bodyContent = 'Bonjour {{first_name}},\n\nLe printemps est la, et avec lui, notre toute nouvelle collection.\n\nDecouvrez nos offres exclusives et beneficiez de remises speciales reservees a votre liste.';
  templates = this.mailService.templates;
  selectedTemplateId = signal<number | null>(null);
  generatedTemplateName = signal<string | null>(null);
  showTemplatePrompt = signal(false);
  templatePrompt = signal('');
  contactLists = signal<ContactList[]>([]);
  selectedContactListId = signal<number | null>(null);
  attachments = signal<File[]>([]);
  scheduleMode = signal<'now' | 'schedule'>('now');
  scheduledDate = signal('');
  scheduledTime = signal('');
  generating = signal(false);
  aiSuggestions = signal<string[]>([]);

  steps = STEPS;
  stepLabel() { return STEPS[this.step()-1].split('. ')[1]; }
  selectedTemplateName() {
    return this.templates().find(template => template.id === this.selectedTemplateId())?.name || 'Aucun template';
  }
  selectedContactListName() {
    return this.contactLists().find(list => list.id === this.selectedContactListId())?.name || 'Aucune';
  }
  attachmentCount() {
    return this.attachments().length;
  }
  sendModeLabel() {
    return this.scheduleMode() === 'now' ? 'Envoi immédiat' : 'Envoi planifié';
  }
  plannedAtLabel() {
    if (this.scheduleMode() !== 'schedule') {
      return 'Maintenant';
    }

    const date = this.scheduledDate();
    const time = this.scheduledTime();

    if (!date && !time) {
      return 'Non défini';
    }

    if (date && time) {
      return `${date} ${time}`;
    }

    return date || time;
  }

  toolbarIcons = [
    'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z',
    'M19 4l-3 9M10 4l-3 9M3 6h18M3 18h18',
    'M4 7h16M4 12h16M4 17h16',
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.contactService.getAllLists().subscribe({
      next: lists => {
        this.contactLists.set(lists);
        if (lists.length > 0 && this.selectedContactListId() === null) {
          this.selectedContactListId.set(lists[0].id);
        }
      },
    });
  }

  next() { if (this.step() < 4) this.step.update(v => v+1); else this.router.navigate(['/campaigns']); }
  prev() { if (this.step() > 1) this.step.update(v => v-1); else this.router.navigate(['/campaigns']); }

  generateAI() {
    this.generating.set(true);
    setTimeout(() => {
      this.aiSuggestions.set(["Boostez vos ventes dès maintenant !", "Une surprise vous attend...", "Ne manquez pas cette offre !"]);
      this.generating.set(false);
    }, 800);
  }

  generateTemplate(): void {
    this.showTemplatePrompt.set(true);
  }

  confirmGenerateTemplate(): void {
    const availableTemplates = this.templates();
    if (availableTemplates.length === 0) {
      this.generatedTemplateName.set('Aucun template disponible');
      this.selectedTemplateId.set(null);
      return;
    }

    const template = availableTemplates[0];
    this.selectedTemplateId.set(template.id);
    const prompt = this.templatePrompt().trim();
    this.generatedTemplateName.set(prompt ? `${template.name} • ${prompt}` : template.name);
    this.showTemplatePrompt.set(false);
  }

  onAttachmentsSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    if (files.length === 0) {
      return;
    }

    this.attachments.update(current => {
      const merged = [...current, ...files];
      return merged.filter((file, index, self) =>
        self.findIndex(item => item.name === file.name && item.size === file.size && item.lastModified === file.lastModified) === index
      );
    });

    input.value = '';
  }

  removeAttachment(index: number): void {
    this.attachments.update(current => current.filter((_, currentIndex) => currentIndex !== index));
  }

  clearAttachments(): void {
    this.attachments.set([]);
  }

  savePlan(): void {
    // Placeholder action for UI flow; backend integration can be wired later.
  }

  startCampaign(): void {
    // Placeholder action for UI flow; backend integration can be wired later.
  }
}
