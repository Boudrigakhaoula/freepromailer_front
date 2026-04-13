import { Injectable, signal } from '@angular/core';
import { Campaign, Contact, Template, Workflow } from '../models';

@Injectable({ providedIn: 'root' })
export class MailService {

  campaigns = signal<Campaign[]>([
    { id: 1, name: "Soldes d'Été 2024 - Phase 1", subject: "Objet: Découvrez nos offres exclusives jusqu'à -50% dès maintenant !", status: 'IN_PROGRESS', progress: 68, type: 'Marketing' },
    { id: 2, name: "Newsletter Mensuelle - Juin", subject: "Objet: Les actualités du mois et nos nouveaux articles de blog.", status: 'COMPLETED', progress: 100, type: 'Information' },
    { id: 3, name: "Relance Panier Abandonné", subject: "Objet: Votre panier vous attend ! Profitez de la livraison offerte.", status: 'PAUSED', progress: 42, type: 'Automated' },
    { id: 4, name: "Webinaire: Intelligence Artificielle", subject: "Objet: Invitation exclusive: Apprenez à maîtriser l'IA pour votre business.", status: 'DRAFT', progress: 15, type: 'Event' },
    { id: 5, name: "Annonce Produit Beta", subject: "Erreur: SMTP Connection Timeout (Port 587)", status: 'FAILED', progress: 4, type: 'Product' },
    { id: 6, name: "Welcome Series - New Users", subject: "Objet: Bienvenue chez FreeProMailer ! On commence par quoi ?", status: 'IN_PROGRESS', progress: 89, type: 'Onboarding' }
  ]);

  contacts = signal<Contact[]>([
    { id: 1, name: 'Alice Martin', email: 'alice.m@example.com', status: 'Subscribed', tags: ['VIP', 'SaaS'], date: '12 Mars 2024' },
    { id: 2, name: 'Bob Durand', email: 'bob.d@company.io', status: 'Subscribed', tags: ['Lead'], date: '10 Mars 2024' },
    { id: 3, name: 'Charlie Leroy', email: 'charlie.l@web.fr', status: 'Unsubscribed', tags: ['Churn'], date: '05 Mars 2024' },
    { id: 4, name: 'David Petit', email: 'david.p@service.com', status: 'Subscribed', tags: ['Partner'], date: '01 Mars 2024' },
    { id: 5, name: 'Eve Roussel', email: 'eve.r@startup.co', status: 'Pending', tags: ['Newsletter'], date: '28 Fév 2024' },
    { id: 6, name: 'Frank Morel', email: 'frank.m@agency.net', status: 'Subscribed', tags: ['VIP'], date: '25 Fév 2024' },
  ]);

  templates = signal<Template[]>([
    { id: 1, name: 'Newsletter Printemps', category: 'Marketing', lastUsed: 'Il y a 2j', image: 'https://picsum.photos/seed/spring/400/300' },
    { id: 2, name: 'Bienvenue Nouveau Client', category: 'Onboarding', lastUsed: 'Il y a 5j', image: 'https://picsum.photos/seed/welcome/400/300' },
    { id: 3, name: 'Relance Panier', category: 'E-commerce', lastUsed: 'Hier', image: 'https://picsum.photos/seed/cart/400/300' },
    { id: 4, name: 'Annonce Produit', category: 'Product', lastUsed: 'Il y a 12j', image: 'https://picsum.photos/seed/product/400/300' },
    { id: 5, name: 'Invitation Webinaire', category: 'Event', lastUsed: 'Il y a 1 mois', image: 'https://picsum.photos/seed/event/400/300' },
    { id: 6, name: 'Confirmation Commande', category: 'Transactional', lastUsed: "Aujourd'hui", image: 'https://picsum.photos/seed/order/400/300' },
  ]);

  workflows = signal<Workflow[]>([
    { id: 1, name: 'Série de Bienvenue', status: 'Active', triggers: 'Inscription', contacts: 1240, openRate: '68%', clickRate: '12%' },
    { id: 2, name: 'Relance Panier Abandonné', status: 'Active', triggers: 'Panier Abandonné', contacts: 450, openRate: '42%', clickRate: '8%' },
    { id: 3, name: 'Réactivation Inactifs', status: 'Paused', triggers: 'Inactivité > 30j', contacts: 2800, openRate: '15%', clickRate: '2%' },
    { id: 4, name: 'Anniversaire Client', status: 'Active', triggers: 'Date Anniversaire', contacts: 890, openRate: '55%', clickRate: '10%' },
    { id: 5, name: 'Suivi Post-Achat', status: 'Draft', triggers: 'Commande Terminée', contacts: 0, openRate: '-', clickRate: '-' },
  ]);

  deleteCampaign(id: number): void {
    this.campaigns.update(list => list.filter(c => c.id !== id));
  }

  deleteContact(id: number): void {
    this.contacts.update(list => list.filter(c => c.id !== id));
  }

  addContact(contact: Omit<Contact, 'id'>): void {
    const id = Date.now();
    this.contacts.update(list => [...list, { ...contact, id }]);
  }

  deleteTemplate(id: number): void {
    this.templates.update(list => list.filter(t => t.id !== id));
  }
}
