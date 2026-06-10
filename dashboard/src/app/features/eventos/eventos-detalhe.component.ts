import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ParishService } from '../../core/services/parish.service';
import { CategoriaEvento, Evento } from '../../core/models/parish.models';

@Component({
  selector: 'app-eventos-detalhe',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './eventos-detalhe.component.html',
  styleUrl: './eventos-detalhe.component.scss'
})
export class EventosDetalheComponent implements OnInit {
  private service   = inject(ParishService);
  private route     = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  evento: Evento | null = null;
  descricaoSegura: SafeHtml = '';
  carregando = true;
  erro = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getEvento(id).subscribe({
      next: e => {
        this.evento = e;
        this.descricaoSegura = this.sanitizer.bypassSecurityTrustHtml(e.descricao ?? '');
        this.carregando = false;
      },
      error: () => { this.erro = true; this.carregando = false; }
    });
  }

  labelCategoria(cat: CategoriaEvento): string {
    const map: Record<CategoriaEvento, string> = {
      missa: 'Missa', encontro: 'Encontro', retiro: 'Retiro',
      festivo: 'Festivo', formacao: 'Formação', social: 'Social'
    };
    return map[cat] ?? cat;
  }

  corCategoria(cat: CategoriaEvento): string {
    const map: Record<CategoriaEvento, string> = {
      missa: '#13335c', encontro: '#2563eb', retiro: '#7c3aed',
      festivo: '#c08a2d', formacao: '#059669', social: '#dc2626'
    };
    return map[cat] ?? '#13335c';
  }
}
