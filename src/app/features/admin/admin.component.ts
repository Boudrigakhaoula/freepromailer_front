import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

const QUEUE = [
  { id:'TX-9921', recipient:'alice@example.com', priority:'High',   status:'Pending',    attempts:0 },
  { id:'TX-9922', recipient:'bob@company.io',    priority:'Medium', status:'Processing', attempts:1 },
  { id:'TX-9923', recipient:'charlie@web.fr',    priority:'Low',    status:'Delayed',    attempts:3 },
  { id:'TX-9924', recipient:'david@service.com', priority:'High',   status:'Pending',    attempts:0 },
  { id:'TX-9925', recipient:'eve@startup.co',    priority:'Medium', status:'Pending',    attempts:0 },
];

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
<div>
  <div class="page-header">
    <div>
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-tertiary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span style="font-size:.625rem;font-weight:900;text-transform:uppercase;letter-spacing:.1em;color:var(--color-tertiary)">Admin Console</span>
      </div>
      <h2 class="page-title">SMTP Queue Control</h2>
      <p class="page-sub">Surveillance système, gestion de la file d'attente SMTP et contrôle des ressources.</p>
    </div>
    <button class="btn btn-danger">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Emergency Stop
    </button>
  </div>

  <!-- System health -->
  <div class="grid-4" style="margin-bottom:2rem">
    <div class="terminal" style="padding:1.5rem">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(39,147,255,.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
        <span style="font-size:.625rem;font-weight:700;color:var(--color-secondary)">HEALTHY</span>
      </div>
      <div style="font-size:.625rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;opacity:.6;color:var(--color-inverse-on-surface);margin-bottom:.25rem">CPU Usage</div>
      <div style="font-size:1.875rem;font-weight:900;font-family:var(--font-headline);color:var(--color-inverse-on-surface)">24.5%</div>
      <div class="prog-track" style="background:rgba(255,255,255,.1);margin-top:1rem"><div class="prog-fill" style="width:24.5%;background:rgba(39,147,255,.7)"></div></div>
    </div>
    <div class="terminal" style="padding:1.5rem">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary-container)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <span style="font-size:.625rem;font-weight:700;color:var(--color-secondary)">STABLE</span>
      </div>
      <div style="font-size:.625rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;opacity:.6;color:var(--color-inverse-on-surface);margin-bottom:.25rem">SMTP Latency</div>
      <div style="font-size:1.875rem;font-weight:900;font-family:var(--font-headline);color:var(--color-inverse-on-surface)">142ms</div>
      <div style="font-size:.625rem;font-weight:700;color:var(--color-secondary);margin-top:1rem">▶ Optimized routing active</div>
    </div>
    <div class="terminal" style="padding:1.5rem">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
        <span style="font-size:.625rem;font-weight:700;color:#f59e0b">WARNING</span>
      </div>
      <div style="font-size:.625rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;opacity:.6;color:var(--color-inverse-on-surface);margin-bottom:.25rem">Queue Size</div>
      <div style="font-size:1.875rem;font-weight:900;font-family:var(--font-headline);color:var(--color-inverse-on-surface)">12,842</div>
      <div class="prog-track" style="background:rgba(255,255,255,.1);margin-top:1rem"><div class="prog-fill" style="width:82%;background:#f59e0b"></div></div>
    </div>
    <div class="terminal" style="padding:1.5rem">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(39,147,255,.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
        <span style="font-size:.625rem;font-weight:700;color:var(--color-secondary)">ONLINE</span>
      </div>
      <div style="font-size:.625rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;opacity:.6;color:var(--color-inverse-on-surface);margin-bottom:.25rem">Worker Nodes</div>
      <div style="font-size:1.875rem;font-weight:900;font-family:var(--font-headline);color:var(--color-inverse-on-surface)">8 / 8</div>
      <div style="display:flex;gap:.25rem;margin-top:1rem">
        @for (n of nodes; track n) { <div style="width:.5rem;height:.5rem;border-radius:50%;background:var(--color-secondary)"></div> }
      </div>
    </div>
  </div>

  <!-- Queue table -->
  <div class="card" style="overflow:hidden;margin-bottom:2rem">
    <div style="padding:1.5rem;border-bottom:1px solid rgba(195,198,215,.1);display:flex;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:1rem">
        <h4 style="font-size:1.125rem;font-weight:700;font-family:var(--font-headline)">SMTP Delivery Queue</h4>
        <div style="display:flex;background:var(--color-surface-container);padding:.25rem;border-radius:.5rem">
          <button style="padding:.25rem .75rem;font-size:.75rem;font-weight:700;background:var(--color-surface-container-lowest);border-radius:.375rem;border:none;cursor:pointer;color:var(--color-primary);box-shadow:0 1px 3px rgba(0,0,0,.08)">Active</button>
          <button style="padding:.25rem .75rem;font-size:.75rem;font-weight:700;background:none;border:none;cursor:pointer;color:var(--color-on-surface-variant)">Failed</button>
          <button style="padding:.25rem .75rem;font-size:.75rem;font-weight:700;background:none;border:none;cursor:pointer;color:var(--color-on-surface-variant)">Scheduled</button>
        </div>
      </div>
      <div style="display:flex;gap:.5rem">
        <button class="btn btn-secondary btn-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.28-4.73L23 4"/></svg>
        </button>
        <button class="btn btn-secondary btn-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </button>
        <button class="btn btn-secondary btn-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        </button>
      </div>
    </div>
    <div style="overflow-x:auto">
      <table class="data-table">
        <thead><tr><th>Transaction ID</th><th>Recipient</th><th>Priority</th><th>Status</th><th>Attempts</th><th style="text-align:right">Actions</th></tr></thead>
        <tbody>
          @for (q of queue; track q.id) {
            <tr>
              <td style="font-weight:700;color:var(--color-primary);font-family:var(--font-technical)">{{q.id}}</td>
              <td style="font-family:var(--font-technical);font-size:.75rem">{{q.recipient}}</td>
              <td>
                <span style="padding:.125rem .5rem;border-radius:.25rem;font-size:.625rem;font-weight:700"
                  [style.background]="q.priority==='High'?'rgba(171,11,28,.1)':q.priority==='Medium'?'rgba(0,74,198,.1)':'var(--color-surface-container-highest)'"
                  [style.color]="q.priority==='High'?'var(--color-tertiary)':q.priority==='Medium'?'var(--color-primary)':'var(--color-on-surface-variant)'">
                  {{q.priority}}
                </span>
              </td>
              <td>
                <div style="display:flex;align-items:center;gap:.5rem">
                  <div style="width:.375rem;height:.375rem;border-radius:50%"
                    [style.background]="q.status==='Processing'?'var(--color-primary)':q.status==='Pending'?'#f59e0b':'var(--color-tertiary)'"
                    [style.animation]="q.status==='Processing'?'pulse 1.5s infinite':''">
                  </div>
                  <span style="font-size:.75rem;font-weight:500">{{q.status}}</span>
                </div>
              </td>
              <td style="font-size:.75rem;color:var(--color-on-surface-variant);font-family:var(--font-technical)">{{q.attempts}} / 5</td>
              <td style="text-align:right">
                <div style="display:flex;justify-content:flex-end;gap:.25rem">
                  <button class="btn btn-icon btn-secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                  </button>
                  <button class="btn btn-icon" style="background:none;border:none;cursor:pointer;padding:.375rem;border-radius:.375rem;color:var(--color-on-surface-variant)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>

  <!-- Live logs -->
  <div class="terminal">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem">
      <div class="terminal-header" style="margin:0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
        System Kernel Logs
      </div>
      <div style="display:flex;align-items:center;gap:1rem">
        <div style="display:flex;align-items:center;gap:.5rem">
          <div style="width:.5rem;height:.5rem;border-radius:50%;background:var(--color-secondary);animation:pulse 1.5s infinite"></div>
          <span style="font-family:var(--font-technical);font-size:.625rem;font-weight:700;color:var(--color-secondary)">LIVE</span>
        </div>
        <button style="font-size:.625rem;font-weight:700;color:var(--color-on-surface-variant);background:none;border:none;cursor:pointer;text-transform:uppercase;letter-spacing:.1em">CLEAR</button>
      </div>
    </div>
    <div style="height:12rem;overflow-y:auto" class="scrollbar-hide">
      @for (log of logs; track log.time) {
        <div class="log-line" [class.warn]="log.type==='warn'" [class.ok]="log.type==='ok'">
          <span class="ts">[{{log.time}}]</span> {{log.msg}}
        </div>
      }
    </div>
  </div>
</div>
  `,
  styles: [`
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
  `]
})
export class AdminComponent {
  queue = QUEUE;
  nodes = Array(8).fill(0);

  logs = [
    { time:'08:23:40', msg:'KERNEL: Initializing SMTP pool worker #4...', type:'' },
    { time:'08:23:41', msg:'NETWORK: TCP connection established with relay.smtp.provider.com:587', type:'' },
    { time:'08:23:42', msg:'AUTH: STARTTLS successful. Session encrypted.', type:'' },
    { time:'08:23:45', msg:'QUEUE: Batch #8821 processed. 50/50 delivered.', type:'ok' },
    { time:'08:23:50', msg:'KERNEL: Garbage collection triggered. 24MB freed.', type:'' },
    { time:'08:23:55', msg:'ALERT: Rate limit warning from @outlook.com. Throttling active.', type:'warn' },
    { time:'08:24:01', msg:'KERNEL: Worker #4 entering idle state.', type:'' },
    { time:'08:24:05', msg:'SYSTEM: Heartbeat pulse received from all nodes.', type:'' },
  ];
}
