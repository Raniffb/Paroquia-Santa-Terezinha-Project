import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminAvisosService } from '../../core/services/admin-avisos.service';
import { AdminCatAviso } from '../../core/models/admin.models';

@Component({
  selector: 'app-avisos-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './avisos-list.component.html',
  styleUrl: './avisos-list.component.scss'
})
export class AvisosListComponent {
  private svc = inject(AdminAvisosService);

  loading         = this.svc.loading;
  filtroCategoria = signal<AdminCatAviso | 'todas'>('todas');
  deleteConfirmId = signal<number | null>(null);

  categorias: { value: AdminCatAviso | 'todas'; label: string }[] = [
    { value: 'todas',         label: 'Todos' },
    { value: 'liturgia',      label: 'Liturgia' },
    { value: 'comunidade',    label: 'Comunidade' },
    { value: 'administrativo',label: 'Administrativo' },
    { value: 'formacao',      label: 'Formação' },
    { value: 'social',        label: 'Social' },
    { value: 'geral',         label: 'Geral' }
  ];

  lista = computed(() => {
    const cat = this.filtroCategoria();
    const items = this.svc.items();
    return cat === 'todas' ? items : items.filter(a => a.categoria === cat);
  });

  setFiltro(cat: AdminCatAviso | 'todas'): void { this.filtroCategoria.set(cat); }

  solicitarDelete(id: number): void { this.deleteConfirmId.set(id); }
  cancelarDelete(): void             { this.deleteConfirmId.set(null); }

  confirmarDelete(id: number): void {
    this.svc.delete(id);
    this.deleteConfirmId.set(null);
  }

  formatarData(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  labelCategoria(cat: AdminCatAviso): string { return this.svc.labelCategoria(cat); }
}
