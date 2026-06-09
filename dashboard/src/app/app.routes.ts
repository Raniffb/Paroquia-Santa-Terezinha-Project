import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { authGuard } from './admin/core/guards/auth.guard';

export const routes: Routes = [
  // ── Login ──────────────────────────────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./admin/features/login/login.component').then(m => m.LoginComponent),
    title: 'Login – Paróquia Santa Teresinha'
  },

  // ── Admin (protegido por authGuard) ─────────────────────────────────────────
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/shared/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./admin/features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard – Admin'
      },
      // Notícias
      {
        path: 'noticias',
        loadComponent: () =>
          import('./admin/features/noticias/noticias-list.component').then(m => m.NoticiasListComponent),
        title: 'Notícias – Admin'
      },
      {
        path: 'noticias/form',
        loadComponent: () =>
          import('./admin/features/noticias/noticias-form.component').then(m => m.NoticiasFormComponent),
        title: 'Nova Notícia – Admin'
      },
      {
        path: 'noticias/form/:id',
        loadComponent: () =>
          import('./admin/features/noticias/noticias-form.component').then(m => m.NoticiasFormComponent),
        title: 'Editar Notícia – Admin'
      },
      // Avisos
      {
        path: 'avisos',
        loadComponent: () =>
          import('./admin/features/avisos/avisos-list.component').then(m => m.AvisosListComponent),
        title: 'Avisos – Admin'
      },
      {
        path: 'avisos/form',
        loadComponent: () =>
          import('./admin/features/avisos/avisos-form.component').then(m => m.AvisosFormComponent),
        title: 'Novo Aviso – Admin'
      },
      {
        path: 'avisos/form/:id',
        loadComponent: () =>
          import('./admin/features/avisos/avisos-form.component').then(m => m.AvisosFormComponent),
        title: 'Editar Aviso – Admin'
      },
      // Eventos
      {
        path: 'eventos',
        loadComponent: () =>
          import('./admin/features/eventos/eventos-list.component').then(m => m.EventosListComponent),
        title: 'Eventos – Admin'
      },
      {
        path: 'eventos/form',
        loadComponent: () =>
          import('./admin/features/eventos/eventos-form.component').then(m => m.EventosFormComponent),
        title: 'Novo Evento – Admin'
      },
      {
        path: 'eventos/form/:id',
        loadComponent: () =>
          import('./admin/features/eventos/eventos-form.component').then(m => m.EventosFormComponent),
        title: 'Editar Evento – Admin'
      },
      // Horários
      {
        path: 'horarios',
        loadComponent: () =>
          import('./admin/features/horarios/horarios-admin.component').then(m => m.HorariosAdminComponent),
        title: 'Horários – Admin'
      }
    ]
  },

  // ── Site público ─────────────────────────────────────────────────────────────
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then(m => m.HomeComponent),
        title: 'Início – Paróquia Santa Teresinha'
      },
      {
        path: 'noticias',
        loadComponent: () =>
          import('./features/noticias/noticias.component').then(m => m.NoticiasComponent),
        title: 'Notícias – Paróquia Santa Teresinha'
      },
      {
        path: 'avisos',
        loadComponent: () =>
          import('./features/avisos/avisos.component').then(m => m.AvisosComponent),
        title: 'Avisos – Paróquia Santa Teresinha'
      },
      {
        path: 'horarios',
        loadComponent: () =>
          import('./features/horarios/horarios.component').then(m => m.HorariosComponent),
        title: 'Horários das Missas – Paróquia Santa Teresinha'
      },
      {
        path: 'eventos',
        loadComponent: () =>
          import('./features/eventos/eventos.component').then(m => m.EventosComponent),
        title: 'Eventos – Paróquia Santa Teresinha'
      },
      {
        path: 'contato',
        loadComponent: () =>
          import('./features/contato/contato.component').then(m => m.ContatoComponent),
        title: 'Contato – Paróquia Santa Teresinha'
      },
      { path: '**', redirectTo: '' }
    ]
  }
];
