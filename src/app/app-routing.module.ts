import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/layout/layout.component').then((m) => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'campaigns',
        loadComponent: () =>
          import('./pages/campaigns/campaigns-list/campaigns-list.component').then(
            (m) => m.CampaignsListComponent
          ),
      },
      {
        path: 'campaigns/new',
        loadComponent: () =>
          import('./pages/campaigns/campaign-editor/campaign-editor.component').then(
            (m) => m.CampaignEditorComponent
          ),
      },
      {
        // Route édition — accessible uniquement si la campagne est DRAFT
        path: 'campaigns/:id/edit',
        loadComponent: () =>
          import('./pages/campaigns/campaign-editor/campaign-editor.component').then(
            (m) => m.CampaignEditorComponent
          ),
      },
      {
        path: 'contacts',
        loadComponent: () =>
          import('./pages/contacts/contacts.component').then((m) => m.ContactsComponent),
      },
      {
        path: 'templates',
        loadComponent: () =>
          import('./pages/templates/templates.component').then((m) => m.TemplatesComponent),
      },
      {
        path: 'automation',
        loadComponent: () =>
          import('./pages/automation/automation.component').then((m) => m.AutomationComponent),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports.component').then((m) => m.ReportsComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('./pages/admin/admin.component').then((m) => m.AdminComponent),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./pages/order-details/order-details.component').then(
            (m) => m.OrderDetailsComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}