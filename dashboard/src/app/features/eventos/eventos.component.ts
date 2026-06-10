import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ParishService } from '../../core/services/parish.service';
import { RealtimeService } from '../../core/services/realtime.service';
import { CategoriaEvento, Evento } from '../../core/models/parish.models';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';

interface FiltroEvento {
  label: string;
  valor: CategoriaEvento | null;
  icon: string;
}

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeroComponent],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss'
})
export class EventosComponent implements OnInit {
  private service  = inject(ParishService);
  private realtime = inject(RealtimeService);

  todos: Evento[] = [];
  visiveis: Evento[] = [];
  categoriaAtiva: CategoriaEvento | null = null;
  mesFiltro: string | null = null;
  meses: string[] = [];

  filtros: FiltroEvento[] = [
    { label: 'Todos',     valor: null,        icon: 'pi-list' },
    { label: 'Missas',    valor: 'missa',     icon: 'pi-sun' },
    { label: 'Encontros', valor: 'encontro',  icon: 'pi-users' },
    { label: 'Retiros',   valor: 'retiro',    icon: 'pi-home' },
    { label: 'Festivos',  valor: 'festivo',   icon: 'pi-star' },
    { label: 'Formação',  valor: 'formacao',  icon: 'pi-book' },
    { label: 'Social',    valor: 'social',    icon: 'pi-heart' }
  ];

  constructor() {
    this.realtime.on('events:changed').pipe(takeUntilDestroyed()).subscribe(() => this.carregar());
  }

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    this.service.getEventos().subscribe(e => {
      this.todos = e;
      this.meses = [...new Set(e.map(ev => ev.mes + '/' + ev.ano))];
      this.aplicarFiltros();
    });
  }

  filtrarCategoria(categoria: CategoriaEvento | null): void {
    this.categoriaAtiva = categoria;
    this.aplicarFiltros();
  }

  filtrarMes(mes: string | null): void {
    this.mesFiltro = mes;
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    this.visiveis = this.todos.filter(e => {
      const passaCategoria = !this.categoriaAtiva || e.categoria === this.categoriaAtiva;
      const passaMes = !this.mesFiltro || (e.mes + '/' + e.ano) === this.mesFiltro;
      return passaCategoria && passaMes;
    });
  }

  labelCategoria(cat: CategoriaEvento): string {
    const map: Record<CategoriaEvento, string> = {
      missa: 'Missa', encontro: 'Encontro', retiro: 'Retiro',
      festivo: 'Festivo', formacao: 'Formação', social: 'Social'
    };
    return map[cat] ?? cat;
  }

  iconCategoria(cat: CategoriaEvento): string {
    const map: Record<CategoriaEvento, string> = {
      missa: 'pi-sun', encontro: 'pi-users', retiro: 'pi-home',
      festivo: 'pi-star', formacao: 'pi-book', social: 'pi-heart'
    };
    return map[cat] ?? 'pi-tag';
  }

  corCategoria(cat: CategoriaEvento): string {
    const map: Record<CategoriaEvento, string> = {
      missa: '#13335c', encontro: '#2563eb', retiro: '#7c3aed',
      festivo: '#c08a2d', formacao: '#059669', social: '#dc2626'
    };
    return map[cat] ?? '#13335c';
  }
}
