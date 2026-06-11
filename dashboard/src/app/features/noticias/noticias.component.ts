import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ParishService } from '../../core/services/parish.service';
import { RealtimeService } from '../../core/services/realtime.service';
import { CategoriaNoticia, Noticia } from '../../core/models/parish.models';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';
import { PaginadorComponent } from '../../shared/components/paginador/paginador.component';

interface FiltroNoticia {
  label: string;
  valor: CategoriaNoticia | null;
}

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeroComponent, PaginadorComponent],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.scss'
})
export class NoticiasComponent implements OnInit {
  private service  = inject(ParishService);
  private realtime = inject(RealtimeService);

  carregando = false;
  todas: Noticia[] = [];
  visiveis: Noticia[] = [];
  categoriaAtiva: CategoriaNoticia | null = null;
  pagina = 0;
  readonly POR_PAGINA = 6;

  get paginados(): Noticia[] {
    return this.visiveis.slice(this.pagina * this.POR_PAGINA, (this.pagina + 1) * this.POR_PAGINA);
  }

  filtros: FiltroNoticia[] = [
    { label: 'Todas',     valor: null },
    { label: 'Paróquia',  valor: 'paroquia' },
    { label: 'Diocese',   valor: 'diocese' },
    { label: 'Social',    valor: 'social' },
    { label: 'Liturgia',  valor: 'liturgia' },
    { label: 'Formação',  valor: 'formacao' }
  ];

  constructor() {
    this.realtime.on('news:changed').pipe(takeUntilDestroyed()).subscribe(() => this.carregar());
  }

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    this.carregando = true;
    this.service.getNoticias().subscribe(n => {
      this.carregando = false;
      this.todas = n;
      this.filtrar(this.categoriaAtiva);
    });
  }

  filtrar(categoria: CategoriaNoticia | null): void {
    this.categoriaAtiva = categoria;
    this.pagina = 0;
    this.visiveis = categoria
      ? this.todas.filter(n => n.categoria === categoria)
      : this.todas;
  }

  mudarPagina(p: number): void { this.pagina = p; }

  formatarData(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  labelCategoria(cat: CategoriaNoticia): string {
    const map: Record<CategoriaNoticia, string> = {
      paroquia: 'Paróquia', diocese: 'Diocese',
      social: 'Social', liturgia: 'Liturgia', formacao: 'Formação'
    };
    return map[cat] ?? cat;
  }
}
