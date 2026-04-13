import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
<div>
  <div class="page-header">
    <div>
      <h2 class="page-title">Analyses & Rapports</h2>
      <p class="page-sub">Plongez dans les données de vos campagnes pour comprendre ce qui fonctionne.</p>
    </div>
    <div style="display:flex;gap:.75rem">
      <button class="btn btn-secondary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Derniers 30 jours
      </button>
      <button class="btn btn-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Exporter PDF
      </button>
    </div>
  </div>

  <!-- KPIs -->
  <div class="grid-4" style="margin-bottom:1.5rem">
    <div class="kpi-card"><div class="kpi-header"><div class="kpi-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div><span class="kpi-trend up">↑ +12.5%</span></div><div class="kpi-label">Taux d'ouverture</div><div class="kpi-value">24.8%</div><p style="font-size:.75rem;color:var(--color-on-surface-variant);margin-top:.5rem">Moy. secteur: 21.2%</p></div>
    <div class="kpi-card"><div class="kpi-header"><div class="kpi-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg></div><span class="kpi-trend up">↑ +12.5%</span></div><div class="kpi-label">Taux de clic</div><div class="kpi-value">3.2%</div><p style="font-size:.75rem;color:var(--color-on-surface-variant);margin-top:.5rem">1,240 clics uniques</p></div>
    <div class="kpi-card"><div class="kpi-header"><div class="kpi-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="11" x2="23" y2="11"/></svg></div><span class="kpi-trend down">↓ -2.4%</span></div><div class="kpi-label">Désabonnement</div><div class="kpi-value">0.42%</div><p style="font-size:.75rem;color:var(--color-on-surface-variant);margin-top:.5rem">Stable vs mois dernier</p></div>
    <div class="kpi-card"><div class="kpi-header"><div class="kpi-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><span class="kpi-trend down">↓ -2.4%</span></div><div class="kpi-label">Taux de rebond</div><div class="kpi-value">1.1%</div><p style="font-size:.75rem;color:var(--color-on-surface-variant);margin-top:.5rem">142 non délivrés</p></div>
  </div>

  <!-- Charts -->
  <div style="display:grid;grid-template-columns:2fr 1fr;gap:1.5rem;margin-bottom:1.5rem">
    <div class="card" style="padding:2rem">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2rem">
        <div>
          <h4 style="font-size:1.125rem;font-weight:700;font-family:var(--font-headline)">Engagement au fil du temps</h4>
          <p style="font-size:.75rem;color:var(--color-on-surface-variant);font-weight:500">Ouvertures et clics comparés</p>
        </div>
      </div>
      <canvas #areaChart style="max-height:320px"></canvas>
    </div>
    <div class="card" style="padding:2rem;display:flex;flex-direction:column">
      <h4 style="font-size:1.125rem;font-weight:700;font-family:var(--font-headline);margin-bottom:.25rem">Répartition par appareil</h4>
      <p style="font-size:.75rem;color:var(--color-on-surface-variant);margin-bottom:1.5rem">Où lisent-ils vos emails ?</p>
      <div style="flex:1;min-height:200px"><canvas #pieChart></canvas></div>
      <div style="margin-top:1.5rem;display:flex;flex-direction:column;gap:.75rem">
        @for (d of deviceData; track d.name) {
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div style="display:flex;align-items:center;gap:.5rem">
              <div style="width:.75rem;height:.75rem;border-radius:50%" [style.background]="d.color"></div>
              <span style="font-size:.875rem;font-weight:700">{{d.name}}</span>
            </div>
            <span style="font-size:.875rem;font-weight:900">{{d.value}}%</span>
          </div>
        }
      </div>
    </div>
  </div>

  <!-- Top campaigns table -->
  <div class="card" style="overflow:hidden">
    <div style="padding:1.5rem 2rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(195,198,215,.1)">
      <h4 style="font-size:1.125rem;font-weight:700;font-family:var(--font-headline)">Campagnes les plus performantes</h4>
    </div>
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead><tr><th>Campagne</th><th style="text-align:center">Ouverture</th><th style="text-align:center">Clic</th><th style="text-align:center">Conversion</th><th style="text-align:right">ROI</th></tr></thead>
        <tbody>
          @for (r of topCampaigns; track r.name) {
            <tr>
              <td style="font-weight:700">{{r.name}}</td>
              <td style="text-align:center;font-weight:900;font-family:var(--font-headline);color:var(--color-secondary)">{{r.open}}</td>
              <td style="text-align:center;font-weight:900;font-family:var(--font-headline);color:var(--color-primary)">{{r.click}}</td>
              <td style="text-align:center;font-weight:900;font-family:var(--font-headline)">{{r.conv}}</td>
              <td style="text-align:right"><span style="padding:.25rem .5rem;background:rgba(0,108,73,.1);color:var(--color-secondary);border-radius:.25rem;font-size:.625rem;font-weight:900">{{r.roi}}</span></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>
</div>
  `
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
