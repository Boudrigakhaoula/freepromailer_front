import { Component, signal, HostListener, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

interface NavItem { label: string; href: string; icon: string; }

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgTemplateOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  notifSvc = inject(NotificationService);
  authSvc  = inject(AuthService);
  sidebarOpen = signal(true);

  navItems: NavItem[] = [
    { label: 'Dashboard',  href: '/dashboard',  icon: 'dashboard'  },
    { label: 'Campaigns',  href: '/campaigns',  icon: 'send'       },
    { label: 'Automation', href: '/automation', icon: 'zap'        },
    { label: 'Contacts',   href: '/contacts',   icon: 'users'      },
    { label: 'Templates',  href: '/templates',  icon: 'file-text'  },
    { label: 'Reports',    href: '/reports',    icon: 'bar-chart'  },
  ];

  bottomItems: NavItem[] = [
    { label: 'Admin',    href: '/admin',    icon: 'shield'   },
    { label: 'Settings', href: '/settings', icon: 'settings' },
  ];

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    if (!(e.target as HTMLElement).closest('.notif-wrap')) {
      this.notifSvc.close();
    }
  }

  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  toggleNotif(e: MouseEvent) { e.stopPropagation(); this.notifSvc.toggle(); }
}
