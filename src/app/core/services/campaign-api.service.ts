import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ContactList,
  ContactListRequest,
  Contact,
  ContactRequest,
  ImportResult,
  Campaign,
} from '../models/campaign.models';

@Injectable({ providedIn: 'root' })
export class CampaignApiService {
  private base = environment.campaignApi ?? 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  // ─── Contact Lists ──────────────────────────────────────────────────────────

  getAllLists(): Observable<ContactList[]> {
    return this.http.get<ContactList[]>(`${this.base}/api/contact-lists`);
  }

  getListById(id: number): Observable<ContactList> {
    return this.http.get<ContactList>(`${this.base}/api/contact-lists/${id}`);
  }

  createList(req: ContactListRequest): Observable<ContactList> {
    return this.http.post<ContactList>(`${this.base}/api/contact-lists`, req);
  }

  updateList(id: number, req: ContactListRequest): Observable<ContactList> {
    return this.http.put<ContactList>(`${this.base}/api/contact-lists/${id}`, req);
  }

  deleteList(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/contact-lists/${id}`);
  }

  getCampaignsByList(listId: number): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.base}/api/contact-lists/${listId}/campaigns`);
  }

  // ─── Contacts ───────────────────────────────────────────────────────────────

  getContactsByList(listId: number): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.base}/api/contacts/list/${listId}`);
  }

  getActiveContactsByList(listId: number): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.base}/api/contacts/list/${listId}/active`);
  }

  getContactById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.base}/api/contacts/${id}`);
  }

  createContact(req: ContactRequest): Observable<Contact> {
    return this.http.post<Contact>(`${this.base}/api/contacts`, req);
  }

  updateContact(id: number, req: ContactRequest): Observable<Contact> {
    return this.http.put<Contact>(`${this.base}/api/contacts/${id}`, req);
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/api/contacts/${id}`);
  }

  unsubscribeContact(id: number): Observable<Contact> {
    return this.http.post<Contact>(`${this.base}/api/contacts/${id}/unsubscribe`, {});
  }

  markBouncedContact(id: number): Observable<Contact> {
    return this.http.post<Contact>(`${this.base}/api/contacts/${id}/bounced`, {});
  }

  importContacts(file: File, listId: number): Observable<ImportResult> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('listId', listId.toString());
    return this.http.post<ImportResult>(`${this.base}/api/contacts/import`, fd);
  }

  // ─── Campaigns ──────────────────────────────────────────────────────────────

  getAllCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.base}/api/campaigns`);
  }
}