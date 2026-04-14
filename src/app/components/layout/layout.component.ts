import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { AuthResponse } from '../../models/auth.models';

interface NavItem { label: string; href: string; icon: string; }

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [AsyncPipe, RouterOutlet, RouterLink, RouterLinkActive, NgTemplateOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  notifSvc = inject(NotificationService);
  authSvc = inject(AuthService);
  router = inject(Router);
  sidebarOpen = signal(true);
  userMenuOpen = signal(false);

  navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { label: 'Campaigns', href: '/campaigns', icon: 'send' },
    { label: 'Automation', href: '/automation', icon: 'zap' },
    { label: 'Contacts', href: '/contacts', icon: 'users' },
    { label: 'Templates', href: '/templates', icon: 'file-text' },
    { label: 'Reports', href: '/reports', icon: 'bar-chart' },
  ];

  bottomItems: NavItem[] = [
    // { label: 'Admin', href: '/admin', icon: 'shield' },
    // { label: 'Settings', href: '/settings', icon: 'settings' },
  ];

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('.notif-wrap')) {
      this.notifSvc.close();
    }
    if (!target.closest('.user-menu-wrap')) {
      this.userMenuOpen.set(false);
    }
  }

  getDisplayName(user: AuthResponse | null): string {
    if (!user) {
      return 'Utilisateur connecté';
    }

    return `${user.firstName} ${user.lastName}`.trim() || user.email;
  }

  getRoleLabel(user: AuthResponse | null): string {
    if (!user?.role) {
      return 'Client';
    }

    const normalizedRole = user.role.replace(/^ROLE_/i, '').toUpperCase();
    if (normalizedRole === 'ADMIN') {
      return 'Admin';
    }
    if (normalizedRole === 'USER') {
      return 'Client';
    }

    return normalizedRole.charAt(0) + normalizedRole.slice(1).toLowerCase();
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
  }

  logout(): void {
    this.authSvc.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  toggleNotif(e: MouseEvent) { e.stopPropagation(); this.notifSvc.toggle(); }
}

