import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ParishService } from '../../core/services/parish.service';
import { RealtimeService } from '../../core/services/realtime.service';
import { Aviso, CategoriaAviso } from '../../core/models/parish.models';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';

interface FiltroAviso {
  label: string;
  valor: CategoriaAviso | null;
  icon: string;
}

@Component({
  selector: 'app-avisos',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeroComponent],
  templateUrl: './avisos.component.html',
  styleUrl: './avisos.component.scss'
})
export class AvisosComponent implements OnInit {
  private service  = inject(ParishService);
  private realtime = inject(RealtimeService);

  carregando = false;
  todos: Aviso[] = [];
  visiveis: Aviso[] = [];
  categoriaAtiva: CategoriaAviso | null = null;

  filtros: FiltroAviso[] = [
    { label: 'Todos',          valor: null,             icon: 'pi-list' },
    { label: 'Liturgia',       valor: 'liturgia',       icon: 'pi-sun' },
    { label: 'Comunidade',     valor: 'comunidade',     icon: 'pi-users' },
    { label: 'Formação',       valor: 'formacao',       icon: 'pi-book' },
    { label: 'Administrativo', valor: 'administrativo', icon: 'pi-briefcase' },
    { label: 'Social',         valor: 'social',         icon: 'pi-heart' }
  ];

  constructor() {
    this.realtime.on('notices:changed').pipe(takeUntilDestroyed()).subscribe(() => this.carregar());
  }

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    this.carregando = true;
    this.service.getAvisos().subscribe(a => {
      this.carregando = false;
      this.todos = a;
      this.filtrar(this.categoriaAtiva);
    });
  }

  filtrar(categoria: CategoriaAviso | null): void {
    this.categoriaAtiva = categoria;
    this.visiveis = categoria
      ? this.todos.filter(a => a.categoria === categoria)
      : this.todos;
  }

  formatarData(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  labelCategoria(cat?: CategoriaAviso): string {
    if (!cat) return '';
    const map: Record<CategoriaAviso, string> = {
      liturgia: 'Liturgia', comunidade: 'Comunidade',
      administrativo: 'Administrativo', formacao: 'Formação',
      social: 'Social', geral: 'Geral'
    };
    return map[cat] ?? cat;
  }

  iconCategoria(cat?: CategoriaAviso): string {
    const map: Record<string, string> = {
      liturgia: 'pi-sun', comunidade: 'pi-users',
      administrativo: 'pi-briefcase', formacao: 'pi-book',
      geral: 'pi-info-circle', social: 'pi-heart'
    };
    return cat ? (map[cat] ?? 'pi-tag') : 'pi-tag';
  }
}
