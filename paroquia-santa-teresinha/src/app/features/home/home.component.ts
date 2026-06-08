import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestaqueComponent } from './components/destaque/destaque.component';
import { AvisosComponent } from './components/avisos/avisos.component';
import { HorariosComponent } from './components/horarios/horarios.component';
import { EventosComponent } from './components/eventos/eventos.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DestaqueComponent, AvisosComponent, HorariosComponent, EventosComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}
