import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParishService } from '../../core/services/parish.service';
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
  private service = inject(ParishService);

  missas: Missa[] = [];
  confissoes: Confissao[] = [];
  observacoes: ObservacaoMissa[] = [];
  sacramentos: Sacramento[] = [];

  carregandoSacramentos = true;
  carregandoObservacoes = true;

  ngOnInit(): void {
    this.service.getMissas().subscribe(m => this.missas = m);
    this.service.getConfissoes().subscribe(c => this.confissoes = c);
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
