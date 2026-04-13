import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './settings.component.html',

  styleUrls: ['./settings.component.css']})
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
