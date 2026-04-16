import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ContactService } from './services/contact.service';
import {
  ContactList,
  ContactListRequest,
  Contact,
  ContactRequest,
  ImportResult,
} from './models/contact.models';

type View = 'lists' | 'contacts';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent implements OnInit {
  private api = inject(ContactService);

  // ─── View state ────────────────────────────────────────────────────────────
  view = signal<View>('lists');
  loading = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // ─── Lists ─────────────────────────────────────────────────────────────────
  lists = signal<ContactList[]>([]);
  selectedList = signal<ContactList | null>(null);
  showListForm = signal(false);
  showListDel = signal(false);
  editListTarget = signal<ContactList | null>(null);
  delListTarget = signal<ContactList | null>(null);
  listForm: ContactListRequest = { name: '', description: '' };

  // ─── Contacts ──────────────────────────────────────────────────────────────
  contacts = signal<Contact[]>([]);
  showContactForm = signal(false);
  showContactDel = signal(false);
  showImport = signal(false);
  showingAllContacts = signal(false);
  showingAllActive = signal(false);
  editContactTarget = signal<Contact | null>(null);
  delContactTarget = signal<Contact | null>(null);
  searchQuery = signal('');
  importLoading = signal(false);
  importResult = signal<ImportResult | null>(null);
  importFile = signal<File | null>(null);
  importDragOver = signal(false);
  currentPage = signal(1);
  readonly pageSize = 200;
  contactForm: ContactRequest = {
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    contactListId: 0,
  };

  // ─── Computed ──────────────────────────────────────────────────────────────
  filteredContacts = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    let filtered = this.contacts();
    if (q) {
      filtered = filtered.filter(c =>
        c.email.toLowerCase().includes(q) ||
        (c.firstName ?? '').toLowerCase().includes(q) ||
        (c.lastName ?? '').toLowerCase().includes(q) ||
        (c.company ?? '').toLowerCase().includes(q)
      );
    }
    // Appliquer la pagination
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return filtered.slice(start, end);
  });

  totalFilteredContacts = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.contacts().length;
    return this.contacts().filter(c =>
      c.email.toLowerCase().includes(q) ||
      (c.firstName ?? '').toLowerCase().includes(q) ||
      (c.lastName ?? '').toLowerCase().includes(q) ||
      (c.company ?? '').toLowerCase().includes(q)
    ).length;
  });

  totalPages = computed(() => Math.ceil(this.totalFilteredContacts() / this.pageSize));

  totalActive = computed(() =>
    this.contacts().filter(c => c.status === 'ACTIVE').length
  );
  totalUnsubscribed = computed(() =>
    this.contacts().filter(c => c.status === 'UNSUBSCRIBED').length
  );
  totalBounced = computed(() =>
    this.contacts().filter(c => c.status === 'BOUNCED').length
  );

  // ─── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    if (this.view() === 'lists') {
      this.loadLists();
      return;
    }

    if (this.showingAllContacts()) {
      this.loadAllContacts(this.showingAllActive());
      this.refreshListsInBackground();
      return;
    }

    const list = this.selectedList();
    if (!list) {
      this.loadLists();
      return;
    }

    this.loadContacts(list.id);
    this.refreshListsInBackground();
  }

  private refreshListsInBackground(): void {
    this.api.getAllLists().subscribe({
      next: lists => this.refreshListStats(lists),
      error: () => {
        // Keep current view data even if background list refresh fails.
      },
    });
  }

  // ─── Lists CRUD ────────────────────────────────────────────────────────────
  loadLists(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getAllLists().subscribe({
      next: lists => {
        this.refreshListStats(lists, () => this.loading.set(false));
      },
      error: err => { this.error.set('Erreur lors du chargement des listes.'); this.loading.set(false); },
    });
  }

  private refreshListStats(lists: ContactList[], done?: () => void): void {
    this.lists.set(lists);

    if (lists.length === 0) {
      done?.();
      return;
    }

    const requests = lists.map(list =>
      this.api.getContactsByList(list.id).pipe(catchError(() => of([] as Contact[])))
    );

    forkJoin(requests).subscribe({
      next: groups => {
        const enrichedLists = lists.map((list, index) => {
          const contacts = groups[index] ?? [];
          const totalContactCount = contacts.length;
          const activeContactCount = contacts.filter(c => c.status === 'ACTIVE').length;

          return {
            ...list,
            totalContactCount,
            activeContactCount,
          };
        });

        this.lists.set(enrichedLists);
        done?.();
      },
      error: () => {
        // On garde les listes chargées même si le recalcul des stats échoue.
        done?.();
      },
    });
  }

  openCreateList(): void {
    this.editListTarget.set(null);
    this.listForm = { name: '', description: '' };
    this.showListForm.set(true);
  }

  openEditList(list: ContactList, e: Event): void {
    e.stopPropagation();
    this.editListTarget.set(list);
    this.listForm = { name: list.name, description: list.description ?? '' };
    this.showListForm.set(true);
  }

  openDelList(list: ContactList, e: Event): void {
    e.stopPropagation();
    this.delListTarget.set(list);
    this.showListDel.set(true);
  }

  saveList(): void {
    if (!this.listForm.name.trim()) return;
    this.loading.set(true);
    const target = this.editListTarget();
    const obs$ = target
      ? this.api.updateList(target.id, this.listForm)
      : this.api.createList(this.listForm);

    obs$.subscribe({
      next: () => {
        this.showListForm.set(false);
        if (target) {
          this.successMessage.set('Liste modifiee avec succes');
          setTimeout(() => this.successMessage.set(null), 4000);
        }
        this.refreshData();
      },
      error: () => { this.error.set('Erreur lors de la sauvegarde.'); this.loading.set(false); },
    });
  }

  confirmDelList(): void {
    const target = this.delListTarget();
    if (!target) return;
    this.api.deleteList(target.id).subscribe({
      next: () => { this.showListDel.set(false); this.refreshData(); },
      error: () => this.error.set('Impossible de supprimer cette liste (campagnes actives ?).'),
    });
  }

  // ─── Navigate to contacts of a list ────────────────────────────────────────
  openList(list: ContactList): void {
    this.showingAllContacts.set(false);
    this.showingAllActive.set(false);
    this.selectedList.set(list);
    this.view.set('contacts');
    this.searchQuery.set('');
    this.loadContacts(list.id);
  }

  openAllContacts(): void {
    if (this.lists().length === 0) return;
    this.showingAllContacts.set(true);
    this.showingAllActive.set(false);
    this.selectedList.set(null);
    this.view.set('contacts');
    this.searchQuery.set('');
    this.loadAllContacts(false);
  }

  openAllActiveContacts(): void {
    if (this.lists().length === 0) return;
    this.showingAllContacts.set(true);
    this.showingAllActive.set(true);
    this.selectedList.set(null);
    this.view.set('contacts');
    this.searchQuery.set('');
    this.loadAllContacts(true);
  }

  backToLists(): void {
    this.showingAllContacts.set(false);
    this.showingAllActive.set(false);
    this.view.set('lists');
    this.selectedList.set(null);
    this.contacts.set([]);
  }

  // ─── Contacts CRUD ─────────────────────────────────────────────────────────
  loadContacts(listId: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.currentPage.set(1);
    this.api.getContactsByList(listId).subscribe({
      next: contacts => { this.contacts.set(contacts); this.loading.set(false); },
      error: () => { this.error.set('Erreur lors du chargement des contacts.'); this.loading.set(false); },
    });
  }

  private loadAllContacts(onlyActive: boolean): void {
    const sourceLists = this.lists();
    this.loading.set(true);
    this.error.set(null);
    this.currentPage.set(1);

    if (sourceLists.length === 0) {
      this.contacts.set([]);
      this.loading.set(false);
      return;
    }

    const requests = sourceLists.map(list =>
      this.api.getContactsByList(list.id).pipe(catchError(() => of([] as Contact[])))
    );

    forkJoin(requests).subscribe({
      next: groups => {
        const merged = groups.flat();
        const deduped = merged.filter((contact, index, self) =>
          self.findIndex(item => item.id === contact.id) === index
        );
        const visibleContacts = onlyActive
          ? deduped.filter(c => c.status === 'ACTIVE')
          : deduped;

        this.contacts.set(visibleContacts);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erreur lors du chargement des contacts.');
        this.loading.set(false);
      },
    });
  }

  openCreateContact(): void {
    const list = this.selectedList();
    if (!list) return;
    this.editContactTarget.set(null);
    this.contactForm = { email: '', firstName: '', lastName: '', company: '', phone: '', contactListId: list.id };
    this.showContactForm.set(true);
  }

  openEditContact(c: Contact): void {
    this.editContactTarget.set(c);
    this.contactForm = {
      email: c.email,
      firstName: c.firstName ?? '',
      lastName: c.lastName ?? '',
      company: c.company ?? '',
      phone: c.phone ?? '',
      contactListId: c.contactListId ?? this.selectedList()!.id,
    };
    this.showContactForm.set(true);
  }

  openDelContact(c: Contact): void {
    this.delContactTarget.set(c);
    this.showContactDel.set(true);
  }

  saveContact(): void {
    if (!this.contactForm.email.trim()) return;
    this.loading.set(true);
    const target = this.editContactTarget();
    const obs$ = target
      ? this.api.updateContact(target.id, this.contactForm)
      : this.api.createContact(this.contactForm);

    obs$.subscribe({
      next: () => {
        this.showContactForm.set(false);
        if (target) {
          this.successMessage.set('Contact modifie avec succes');
          setTimeout(() => this.successMessage.set(null), 4000);
        }
        this.refreshData();
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Erreur lors de la sauvegarde du contact.');
        this.loading.set(false);
      },
    });
  }

  confirmDelContact(): void {
    const target = this.delContactTarget();
    if (!target) return;
    this.api.deleteContact(target.id).subscribe({
      next: () => {
        this.showContactDel.set(false);
        this.successMessage.set('Contact supprimé avec succès');
        setTimeout(() => this.successMessage.set(null), 4000);
        this.refreshData();
      },
      error: () => this.error.set('Erreur lors de la suppression.'),
    });
  }

  // ─── Import ────────────────────────────────────────────────────────────────
  openImport(): void {
    this.importFile.set(null);
    this.importResult.set(null);
    this.showImport.set(true);
  }

  onFileDrop(e: DragEvent): void {
    e.preventDefault();
    this.importDragOver.set(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) this.importFile.set(file);
  }

  onFileSelect(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.importFile.set(file);
  }

  launchImport(): void {
    const file = this.importFile();
    const list = this.selectedList();
    if (!file || !list) return;
    this.importLoading.set(true);
    this.api.importContacts(file, list.id).subscribe({
      next: result => {
        this.importResult.set(result);
        this.importLoading.set(false);
        this.refreshData();
      },
      error: () => {
        this.error.set('Erreur lors de l\'import.');
        this.importLoading.set(false);
      },
    });
  }

  closeImport(): void {
    this.showImport.set(false);
    this.importFile.set(null);
    this.importResult.set(null);
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────
  statusLabel(s: string): string {
    const map: Record<string, string> = {
      ACTIVE: 'ACTIF', SENT: 'ENVOYÉ', UNSUBSCRIBED: 'DÉSABONNÉ',
      BOUNCED: 'BOUNCED', SUPPRESSED: 'SUPPRIMÉ', INVALID: 'INVALIDE',
    };
    return map[s] ?? s;
  }

  statusClass(s: string): Record<string, boolean> {
    return {
      'badge-active': s === 'ACTIVE',
      'badge-sent': s === 'SENT',
      'badge-unsub': s === 'UNSUBSCRIBED',
      'badge-bounced': s === 'BOUNCED',
      'badge-suppressed': s === 'SUPPRESSED',
      'badge-invalid': s === 'INVALID',
    };
  }

  initials(c: Contact): string {
    const f = c.firstName?.charAt(0) ?? '';
    const l = c.lastName?.charAt(0) ?? '';
    return (f + l) || c.email.charAt(0).toUpperCase();
  }

  fullName(c: Contact): string {
    const parts = [c.firstName, c.lastName].filter(Boolean);
    return parts.length ? parts.join(' ') : c.email;
  }

  formatDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  dismissError(): void { this.error.set(null); }

  getTotalContacts(): number {
    return this.lists().reduce((sum, l) => sum + (l.totalContactCount ?? 0), 0);
  }

  getTotalActive(): number {
    return this.lists().reduce((sum, l) => sum + (l.activeContactCount ?? 0), 0);
  }

  getActiveRate(): number {
    const total = this.getTotalContacts();
    if (total === 0) return 0;
    return Math.round(this.getTotalActive() / total * 100);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }
}