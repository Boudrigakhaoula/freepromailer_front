import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const WORKFLOWS = [
  { id:1, name:'Série de Bienvenue', status:'Active', triggers:'Inscription', contacts:1240, openRate:'68%' },
  { id:2, name:'Relance Panier Abandonné', status:'Active', triggers:'Panier Abandonné', contacts:450, openRate:'42%' },
  { id:3, name:'Réactivation Inactifs', status:'Paused', triggers:'Inactivité > 30j', contacts:2800, openRate:'15%' },
  { id:4, name:'Anniversaire Client', status:'Active', triggers:'Date Anniversaire', contacts:890, openRate:'55%' },
  { id:5, name:'Suivi Post-Achat', status:'Draft', triggers:'Commande Terminée', contacts:0, openRate:'-' },
];

@Component({
  selector: 'app-automation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './automation.component.html',
  styleUrls: ['./automation.component.css'],
})
export class AutomationComponent {
  workflows = WORKFLOWS;
  builderOpen = signal(false);
  showModal   = signal(false);
  newName     = '';
  newTrigger  = 'Nouvel Abonné';
}
