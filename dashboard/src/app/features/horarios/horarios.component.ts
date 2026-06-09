import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParishService } from '../../core/services/parish.service';
import { Confissao, Missa, ObservacaoMissa } from '../../core/models/parish.models';
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

  ngOnInit(): void {
    this.service.getMissas().subscribe(m => this.missas = m);
    this.service.getConfissoes().subscribe(c => this.confissoes = c);
    this.service.getObservacoesMissa().subscribe(o => this.observacoes = o);
  }
}
