import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ParishService } from '../../core/services/parish.service';
import { RealtimeService } from '../../core/services/realtime.service';
import { Confissao, Missa, ObservacaoMissa, Sacramento } from '../../core/models/parish.models';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, PageHeroComponent],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.scss'
})
export class HorariosComponent implements OnInit {
  private service  = inject(ParishService);
  private realtime = inject(RealtimeService);

  missas: Missa[] = [];
  confissoes: Confissao[] = [];
  observacoes: ObservacaoMissa[] = [];
  sacramentos: Sacramento[] = [];

  carregandoMissas      = true;
  carregandoConfissoes  = true;
  carregandoSacramentos = true;
  carregandoObservacoes = true;

  constructor() {
    this.realtime.on('schedules:changed').pipe(takeUntilDestroyed()).subscribe(() => this.carregar());
  }

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    this.service.getMissas().subscribe({
      next: m => { this.missas = m; this.carregandoMissas = false; },
      error: ()  => { this.carregandoMissas = false; }
    });
    this.service.getConfissoes().subscribe({
      next: c => { this.confissoes = c; this.carregandoConfissoes = false; },
      error: ()  => { this.carregandoConfissoes = false; }
    });
    this.service.getSacramentos().subscribe({
      next: s => { this.sacramentos = s; this.carregandoSacramentos = false; },
      error: ()  => { this.carregandoSacramentos = false; }
    });
    this.service.getObservacoesMissa().subscribe({
      next: o => { this.observacoes = o; this.carregandoObservacoes = false; },
      error: ()  => { this.carregandoObservacoes = false; }
    });
  }
}
