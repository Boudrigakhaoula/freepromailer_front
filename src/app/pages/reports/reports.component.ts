import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('areaChart') areaRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart')  pieRef!: ElementRef<HTMLCanvasElement>;
  private charts: Chart[] = [];

  deviceData = [
    { name: 'Mobile', value: 65, color: 'var(--color-primary)' },
    { name: 'Desktop', value: 30, color: 'var(--color-secondary)' },
    { name: 'Tablette', value: 5, color: 'var(--color-tertiary)' },
  ];

  topCampaigns = [
    { name: "Soldes d'Hiver 2024", open:'32.4%', click:'5.1%', conv:'2.4%', roi:'x12.5' },
    { name: 'Lancement Produit X', open:'28.1%', click:'4.2%', conv:'1.8%', roi:'x8.2' },
    { name: 'Newsletter Tech #42', open:'26.5%', click:'3.8%', conv:'0.9%', roi:'x4.1' },
    { name: 'Relance Abandon Panier', open:'42.0%', click:'8.4%', conv:'5.2%', roi:'x24.0' },
  ];

  ngAfterViewInit() {
    const labels = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
    const aCtx = this.areaRef.nativeElement.getContext('2d')!;
    const gradient = aCtx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0,74,198,.12)');
    gradient.addColorStop(1, 'rgba(0,74,198,0)');
    this.charts.push(new Chart(aCtx, {
      type: 'line',
      data: { labels, datasets: [{ label: 'Ouvertures', data: [2400,1398,9800,3908,4800,3800,4300], fill: true, backgroundColor: gradient, borderColor: 'rgba(0,74,198,1)', borderWidth: 3, tension: .4, pointRadius: 4, pointBackgroundColor: '#fff', pointBorderColor: 'rgba(0,74,198,1)', pointBorderWidth: 2 }] },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#434655', font: { size: 11 } } }, y: { grid: { color: 'rgba(195,198,215,.2)' }, ticks: { color: '#434655', font: { size: 11 } } } } }
    }));

    const pCtx = this.pieRef.nativeElement.getContext('2d')!;
    this.charts.push(new Chart(pCtx, {
      type: 'doughnut',
      data: { labels: this.deviceData.map(d=>d.name), datasets: [{ data: this.deviceData.map(d=>d.value), backgroundColor: ['rgba(0,74,198,.8)','rgba(0,108,73,.8)','rgba(171,11,28,.8)'], borderWidth: 0, hoverOffset: 4 }] },
      options: { responsive: true, cutout: '65%', plugins: { legend: { display: false } } }
    }));
  }

  ngOnDestroy() { this.charts.forEach(c => c.destroy()); }
}
