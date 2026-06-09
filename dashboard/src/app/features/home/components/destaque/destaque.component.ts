import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { animate, style, transition, trigger } from '@angular/animations';
import { ParishService } from '../../../../core/services/parish.service';
import { RealtimeService } from '../../../../core/services/realtime.service';
import { ItemDestaque } from '../../../../core/models/parish.models';

@Component({
  selector: 'app-destaque',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './destaque.component.html',
  styleUrl: './destaque.component.scss',
  animations: [
    trigger('slide', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('380ms cubic-bezier(.4,0,.2,1)', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('380ms cubic-bezier(.4,0,.2,1)', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class DestaqueComponent implements OnInit, OnDestroy {
  private service  = inject(ParishService);
  private realtime = inject(RealtimeService);

  itens: ItemDestaque[] = [];
  indiceAtual = 0;
  // animDir controla qual animação disparar — sobe para frente, desce para trás
  animDir = 0;
  carregando = true;

  private timer: ReturnType<typeof setInterval> | null = null;
  private readonly INTERVALO_MS = 5000;

  constructor() {
    const reload = () => this.carregar();
    this.realtime.on('notices:changed').pipe(takeUntilDestroyed()).subscribe(reload);
    this.realtime.on('news:changed').pipe(takeUntilDestroyed()).subscribe(reload);
    this.realtime.on('events:changed').pipe(takeUntilDestroyed()).subscribe(reload);
  }

  ngOnInit(): void { this.carregar(); }

  ngOnDestroy(): void { this.pararTimer(); }

  private carregar(): void {
    this.service.getDestaques().subscribe({
      next: itens => {
        this.itens = itens;
        this.indiceAtual = 0;
        this.animDir = 0;
        this.carregando = false;
        this.reiniciarTimer();
      },
      error: () => { this.carregando = false; }
    });
  }

  private reiniciarTimer(): void {
    this.pararTimer();
    if (this.itens.length > 1) {
      this.timer = setInterval(() => this.avancarAuto(), this.INTERVALO_MS);
    }
  }

  private pararTimer(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  private avancarAuto(): void {
    this.animDir++;
    this.indiceAtual = (this.indiceAtual + 1) % this.itens.length;
  }

  avancar(): void {
    this.animDir++;
    this.indiceAtual = (this.indiceAtual + 1) % this.itens.length;
    this.reiniciarTimer();
  }

  recuar(): void {
    this.animDir--;
    this.indiceAtual = (this.indiceAtual - 1 + this.itens.length) % this.itens.length;
    this.reiniciarTimer();
  }

  irPara(i: number): void {
    if (i === this.indiceAtual) return;
    i > this.indiceAtual ? this.animDir++ : this.animDir--;
    this.indiceAtual = i;
    this.reiniciarTimer();
  }

  get itemAtual(): ItemDestaque | null {
    return this.itens[this.indiceAtual] ?? null;
  }

  badgeTipo(tipo: ItemDestaque['tipo']): string {
    return { aviso: 'Aviso', noticia: 'Notícia', evento: 'Evento' }[tipo];
  }

  iconeTipo(tipo: ItemDestaque['tipo']): string {
    return { aviso: 'pi-bell', noticia: 'pi-book', evento: 'pi-calendar' }[tipo];
  }

  formatarData(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }
}
