import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginador.component.html',
  styleUrl: './paginador.component.scss'
})
export class PaginadorComponent implements OnChanges {
  private el = inject(ElementRef);

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
      // Após o Angular re-renderizar a lista, rola até o topo da seção pai
      setTimeout(() => {
        const ancora: Element | null =
          this.el.nativeElement.closest('section') ??
          this.el.nativeElement.closest('.pst-page-content');
        if (ancora) {
          ancora.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    }
  }
}
