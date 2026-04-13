import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)},
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'campaigns', loadComponent: () => import('./features/campaigns/campaigns-list/campaigns-list.component').then(m => m.CampaignsListComponent) },
      { path: 'campaigns/new', loadComponent: () => import('./features/campaigns/campaign-editor/campaign-editor.component').then(m => m.CampaignEditorComponent) },
      { path: 'contacts', loadComponent: () => import('./features/contacts/contacts.component').then(m => m.ContactsComponent) },
      { path: 'templates', loadComponent: () => import('./features/templates/templates.component').then(m => m.TemplatesComponent) },
      { path: 'automation', loadComponent: () => import('./features/automation/automation.component').then(m => m.AutomationComponent) },
      { path: 'reports', loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) },
      { path: 'admin', loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent) },
      { path: 'orders/:id', loadComponent: () => import('./features/order-details/order-details.component').then(m => m.OrderDetailsComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
