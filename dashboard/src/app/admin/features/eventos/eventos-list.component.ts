import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminEventosService } from '../../core/services/admin-eventos.service';
import { AdminCatEvento } from '../../core/models/admin.models';

@Component({
  selector: 'app-eventos-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './eventos-list.component.html',
  styleUrl: './eventos-list.component.scss'
})
export class EventosListComponent {
  private svc = inject(AdminEventosService);

  filtroCategoria = signal<AdminCatEvento | 'todas'>('todas');
  deleteConfirmId = signal<number | null>(null);

  categorias: { value: AdminCatEvento | 'todas'; label: string }[] = [
    { value: 'todas',    label: 'Todos' },
    { value: 'missa',    label: 'Missa' },
    { value: 'encontro', label: 'Encontro' },
    { value: 'retiro',   label: 'Retiro' },
    { value: 'festivo',  label: 'Festivo' },
    { value: 'formacao', label: 'Formação' },
    { value: 'social',   label: 'Social' }
  ];

  lista = computed(() => {
    const cat = this.filtroCategoria();
    const items = this.svc.items();
    return cat === 'todas' ? items : items.filter(e => e.categoria === cat);
  });

  setFiltro(cat: AdminCatEvento | 'todas'): void { this.filtroCategoria.set(cat); }

  solicitarDelete(id: number): void { this.deleteConfirmId.set(id); }
  cancelarDelete(): void             { this.deleteConfirmId.set(null); }

  confirmarDelete(id: number): void {
    this.svc.delete(id);
    this.deleteConfirmId.set(null);
  }

  formatarData(iso: string): string {
    return this.svc.formatarData(iso);
  }

  labelCategoria(cat: AdminCatEvento): string { return this.svc.labelCategoria(cat); }
}
