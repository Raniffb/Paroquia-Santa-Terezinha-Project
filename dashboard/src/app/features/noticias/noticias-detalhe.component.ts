import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ParishService } from '../../core/services/parish.service';
import { Noticia } from '../../core/models/parish.models';

@Component({
  selector: 'app-noticias-detalhe',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './noticias-detalhe.component.html',
  styleUrl: './noticias-detalhe.component.scss'
})
export class NoticiasDetalheComponent implements OnInit {
  private service   = inject(ParishService);
  private route     = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  noticia: Noticia | null = null;
  corpoSeguro: SafeHtml = '';
  carregando = true;
  erro = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getNoticia(id).subscribe({
      next: n => {
        this.noticia = n ?? null;
        this.corpoSeguro = this.sanitizer.bypassSecurityTrustHtml(n?.corpo ?? '');
        this.carregando = false;
      },
      error: () => { this.erro = true; this.carregando = false; }
    });
  }

  formatarData(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  labelCategoria(cat: string): string {
    const map: Record<string, string> = {
      paroquia: 'Paróquia', diocese: 'Diocese',
      social: 'Social', liturgia: 'Liturgia', formacao: 'Formação'
    };
    return map[cat] ?? cat;
  }
}
