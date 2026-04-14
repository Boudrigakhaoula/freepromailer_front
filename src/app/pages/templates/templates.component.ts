import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MailService } from '../../services/mail.service';
import { Template } from '../../core/models';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css'],
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
