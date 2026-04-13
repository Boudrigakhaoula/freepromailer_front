import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent {
  order: any;

  constructor(private route: ActivatedRoute, private router: Router) {
    const id = this.route.snapshot.paramMap.get('id') || 'INV-2024-001';
    this.order = {
      id,
      date: '01 Mars 2024',
      status: 'Payée',
      amount: '29.00€',
      tax: '4.83€',
      total: '33.83€',
      paymentMethod: 'Visa ending in 4242',
      customer: { name: 'Jean Dupont', company: 'Dupont & Co', address: '123 Rue de la Paix, 75002 Paris, France', email: 'jean.dupont@company.io' },
      items: [
        { description: 'Abonnement FreeProMailer - Plan Pro', qty: 1, price: '29.00€', total: '29.00€', period: '01 Mars 2024 – 31 Mars 2024' },
        { description: 'Crédits SMS Supplémentaires (Pack 100)', qty: 0, price: '5.00€', total: '0.00€', period: null },
      ]
    };
  }

  back() { this.router.navigate(['/settings']); }
}
