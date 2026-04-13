import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const barData = [400,300,200,500,600,800,450,350,550,400,900,400,300,600,700,500,400,300,450,250,500];
const labels  = Array.from({length:21},(_,i)=>`${String(i+1).padStart(2,'0')} Jan`);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',

  styleUrls: ['./dashboard.component.css']})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  campaigns = [
    { name: "Soldes d'Hiver 2024", date: "Envoyée il y a 2h", statusLabel: 'ACTIVE', badgeClass: 'active', progress: 85, sent: '12,402', total: '14,500' },
    { name: "Newsletter Mensuelle - Jan", date: "Terminée hier", statusLabel: 'TERMINÉE', badgeClass: 'done', progress: 100, sent: '8,902', total: '8,902' },
    { name: "Lancement Produit Beta", date: "Dernière modif il y a 3j", statusLabel: 'BROUILLON', badgeClass: 'draft', progress: 0, sent: 'En attente', total: '-' },
  ];

  ngAfterViewInit() {
    const ctx = this.barChartRef.nativeElement.getContext('2d')!;
    const colors = barData.map((_, i) => i === 10 ? 'rgba(0,74,198,1)' : 'rgba(224,227,229,1)');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ data: barData, backgroundColor: colors, borderRadius: 2 }] },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ctx.parsed.y + ' sent' } } },
        scales: { x: { grid: { display: false }, ticks: { maxTicksLimit: 5, color: '#434655', font: { size: 10 } } }, y: { display: false } }
      }
    });
  }

  ngOnDestroy() { this.chart?.destroy(); }
}
