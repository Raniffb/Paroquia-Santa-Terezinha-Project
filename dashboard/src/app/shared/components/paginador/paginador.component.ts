import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginador.component.html',
  styleUrl: './paginador.component.scss'
})
export class PaginadorComponent implements OnChanges {
  @Input() total = 0;
  @Input() porPagina = 5;
  @Input() paginaAtual = 0;
  @Output() mudouPagina = new EventEmitter<number>();

  paginas: number[] = [];

  get totalPaginas(): number {
    return Math.ceil(this.total / this.porPagina);
  }

  ngOnChanges(): void {
    this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i);
  }

  ir(p: number): void {
    if (p >= 0 && p < this.totalPaginas && p !== this.paginaAtual) {
      this.mudouPagina.emit(p);
    }
  }
}
