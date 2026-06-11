import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ParishService } from '../../../../core/services/parish.service';
import { RealtimeService } from '../../../../core/services/realtime.service';
import { PaginadorComponent } from '../../../../shared/components/paginador/paginador.component';

interface ItemUnificado {
  tipo: 'aviso' | 'noticia';
  id: number;
  titulo: string;
  resumo: string;
  data: string;
  urgente?: boolean;
  rota: string;
}

@Component({
  selector: 'app-avisos',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginadorComponent],
  templateUrl: './avisos.component.html',
  styleUrl: './avisos.component.scss'
})
export class AvisosComponent implements OnInit {
  private service  = inject(ParishService);
  private realtime = inject(RealtimeService);

  itens: ItemUnificado[] = [];
  carregando = true;
  pagina = 0;
  readonly POR_PAGINA = 5;

  get paginados(): ItemUnificado[] {
    return this.itens.slice(this.pagina * this.POR_PAGINA, (this.pagina + 1) * this.POR_PAGINA);
  }

  constructor() {
    this.realtime.on('notices:changed').pipe(takeUntilDestroyed()).subscribe(() => this.carregar());
    this.realtime.on('news:changed').pipe(takeUntilDestroyed()).subscribe(() => this.carregar());
  }

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    forkJoin({
      avisos: this.service.getAvisos(),
      noticias: this.service.getNoticias(),
    }).subscribe({
      next: ({ avisos, noticias }) => {
        const combinados: ItemUnificado[] = [
          ...avisos.map(a => ({
            tipo: 'aviso' as const,
            id: a.id,
            titulo: a.titulo,
            resumo: a.resumo,
            data: a.data,
            urgente: a.urgente,
            rota: `/avisos/${a.id}`,
          })),
          ...noticias.map(n => ({
            tipo: 'noticia' as const,
            id: n.id,
            titulo: n.titulo,
            resumo: n.resumo,
            data: n.data,
            rota: `/noticias/${n.id}`,
          })),
        ];
        this.itens = combinados.sort((a, b) => b.data.localeCompare(a.data));
        this.carregando = false;
      },
      error: () => { this.carregando = false; }
    });
  }

  mudarPagina(p: number): void {
    this.pagina = p;
  }

  formatarData(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short'
    });
  }
}
