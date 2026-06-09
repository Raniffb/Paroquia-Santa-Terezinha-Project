import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminNoticiasService } from '../../core/services/admin-noticias.service';
import { AdminAvisosService } from '../../core/services/admin-avisos.service';
import { AdminEventosService } from '../../core/services/admin-eventos.service';

interface CardResumo { label: string; valor: number; icone: string; rota: string; cor: string; }

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private svcNoticias = inject(AdminNoticiasService);
  private svcAvisos   = inject(AdminAvisosService);
  private svcEventos  = inject(AdminEventosService);

  cards = computed<CardResumo[]>(() => [
    { label: 'Notícias',        valor: this.svcNoticias.items().length,                  icone: 'pi pi-file',     rota: '/admin/noticias', cor: '#2563eb' },
    { label: 'Avisos ativos',   valor: this.svcAvisos.items().filter(a => a.ativo).length,   icone: 'pi pi-bell',     rota: '/admin/avisos',   cor: '#16a34a' },
    { label: 'Eventos futuros', valor: this.svcEventos.items().filter(e => e.publicado).length, icone: 'pi pi-calendar', rota: '/admin/eventos',  cor: '#9333ea' },
    { label: 'Avisos urgentes', valor: this.svcAvisos.items().filter(a => a.urgente).length, icone: 'pi pi-exclamation-triangle', rota: '/admin/avisos', cor: '#dc2626' }
  ]);

  proximosEventos = computed(() =>
    this.svcEventos.items()
      .filter(e => e.publicado)
      .sort((a, b) => a.data.localeCompare(b.data))
      .slice(0, 5)
  );

  ultimasNoticias = computed(() =>
    this.svcNoticias.items()
      .sort((a, b) => b.data.localeCompare(a.data))
      .slice(0, 4)
  );

  formatarData(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }
}
