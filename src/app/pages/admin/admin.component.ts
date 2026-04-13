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
  templateUrl: './admin.component.html',

  styleUrls: ['./admin.component.css']})
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
