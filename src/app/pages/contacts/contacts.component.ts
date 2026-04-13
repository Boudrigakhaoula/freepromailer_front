import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MailService } from '../../services/mail.service';
import { Contact } from '../../models';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
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
