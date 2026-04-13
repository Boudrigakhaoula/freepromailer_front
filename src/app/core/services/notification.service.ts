import { Injectable, signal } from '@angular/core';
import { Notification } from '../../models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  isOpen = signal(false);

  notifications = signal<Notification[]>([
    { id: 1, title: "Campagne Terminée", message: "Votre campagne 'Soldes d'Été' a été envoyée avec succès à 5,420 contacts.", time: "Il y a 2 min", type: "success" },
    { id: 2, title: "Alerte de Sécurité", message: "Nouvelle connexion détectée depuis un nouvel appareil à Paris, France.", time: "Il y a 1 heure", type: "warning" },
    { id: 3, title: "Quota Atteint", message: "Vous avez atteint 80% de votre quota d'envoi mensuel. Pensez à upgrader.", time: "Il y a 3 heures", type: "error" },
    { id: 4, title: "Nouveau Contact", message: "12 nouveaux contacts ont été ajoutés via votre formulaire d'inscription.", time: "Il y a 5 heures", type: "info" },
  ]);

  toggle(): void {
    this.isOpen.update(v => !v);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
