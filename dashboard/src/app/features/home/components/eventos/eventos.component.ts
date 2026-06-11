import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ParishService } from '../../../../core/services/parish.service';
import { Evento } from '../../../../core/models/parish.models';
import { PaginadorComponent } from '../../../../shared/components/paginador/paginador.component';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink, PaginadorComponent],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss'
})
export class EventosComponent implements OnInit {
  private service = inject(ParishService);
  eventos: Evento[] = [];
  carregando = true;
  pagina = 0;
  readonly POR_PAGINA = 5;

  get paginados(): Evento[] {
    return this.eventos.slice(this.pagina * this.POR_PAGINA, (this.pagina + 1) * this.POR_PAGINA);
  }

  ngOnInit(): void {
    this.service.getEventos().subscribe({
      next: e => { this.eventos = e; this.carregando = false; },
      error: ()  => { this.carregando = false; }
    });
  }

  mudarPagina(p: number): void {
    this.pagina = p;
  }
}
