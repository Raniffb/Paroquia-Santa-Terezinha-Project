import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
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
