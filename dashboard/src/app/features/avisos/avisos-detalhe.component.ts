import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ParishService } from '../../core/services/parish.service';
import { Aviso } from '../../core/models/parish.models';

@Component({
  selector: 'app-avisos-detalhe',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './avisos-detalhe.component.html',
  styleUrl: './avisos-detalhe.component.scss'
})
export class AvisosDetalheComponent implements OnInit {
  private service = inject(ParishService);
  private route   = inject(ActivatedRoute);

  aviso: Aviso | null = null;
  carregando = true;
  erro = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getAviso(id).subscribe({
      next: a => { this.aviso = a; this.carregando = false; },
      error: ()  => { this.erro = true; this.carregando = false; }
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
      liturgia: 'Liturgia', comunidade: 'Comunidade',
      administrativo: 'Administrativo', formacao: 'Formação',
      social: 'Social', geral: 'Geral'
    };
    return map[cat] ?? cat;
  }
}
