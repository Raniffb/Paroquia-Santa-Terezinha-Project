import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ParishService } from '../../../../core/services/parish.service';
import { Evento } from '../../../../core/models/parish.models';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss'
})
export class EventosComponent implements OnInit {
  private service = inject(ParishService);
  eventos: Evento[] = [];

  ngOnInit(): void {
    this.service.getEventos().subscribe(e => this.eventos = e.slice(0, 4));
  }
}
