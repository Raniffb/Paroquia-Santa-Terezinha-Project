import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParishService } from '../../core/services/parish.service';
import { CategoriaNoticia, Noticia } from '../../core/models/parish.models';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';

interface FiltroNoticia {
  label: string;
  valor: CategoriaNoticia | null;
}

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, PageHeroComponent],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.scss'
})
export class NoticiasComponent implements OnInit {
  private service = inject(ParishService);

  todas: Noticia[] = [];
  visiveis: Noticia[] = [];
  categoriaAtiva: CategoriaNoticia | null = null;

  filtros: FiltroNoticia[] = [
    { label: 'Todas',     valor: null },
    { label: 'Paróquia',  valor: 'paroquia' },
    { label: 'Diocese',   valor: 'diocese' },
    { label: 'Social',    valor: 'social' },
    { label: 'Liturgia',  valor: 'liturgia' },
    { label: 'Formação',  valor: 'formacao' }
  ];

  ngOnInit(): void {
    this.service.getNoticias().subscribe(n => {
      this.todas = n;
      this.visiveis = n;
    });
  }

  filtrar(categoria: CategoriaNoticia | null): void {
    this.categoriaAtiva = categoria;
    this.visiveis = categoria
      ? this.todas.filter(n => n.categoria === categoria)
      : this.todas;
  }

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
