import { Component, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const STEPS = ['1. Infos générales','2. Contenu','3. Destinataires','4. Planification'];

@Component({
  selector: 'app-campaign-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaign-editor.component.html',
  styleUrls: ['./campaign-editor.component.css'],
})
export class CampaignEditorComponent {
  step = signal(1);
  campaignName = 'Ma Super Campagne';
  subject = 'Découvrez nos nouveautés...';
  generating = signal(false);
  aiSuggestions = signal<string[]>([]);

  steps = STEPS;
  stepLabel() { return STEPS[this.step()-1].split('. ')[1]; }

  toolbarIcons = [
    'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z',
    'M19 4l-3 9M10 4l-3 9M3 6h18M3 18h18',
    'M4 7h16M4 12h16M4 17h16',
  ];

  constructor(private router: Router) {}

  next() { if (this.step() < 4) this.step.update(v => v+1); else this.router.navigate(['/campaigns']); }
  prev() { if (this.step() > 1) this.step.update(v => v-1); else this.router.navigate(['/campaigns']); }

  generateAI() {
    this.generating.set(true);
    setTimeout(() => {
      this.aiSuggestions.set(["Boostez vos ventes dès maintenant !", "Une surprise vous attend...", "Ne manquez pas cette offre !"]);
      this.generating.set(false);
    }, 800);
  }
}
