import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminNoticiasService } from '../../core/services/admin-noticias.service';
import { AdminCatNoticia } from '../../core/models/admin.models';

@Component({
  selector: 'app-noticias-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './noticias-list.component.html',
  styleUrl: './noticias-list.component.scss'
})
export class NoticiasListComponent {
  private svc = inject(AdminNoticiasService);

  loading         = this.svc.loading;
  filtroCategoria = signal<AdminCatNoticia | 'todas'>('todas');
  deleteConfirmId = signal<number | null>(null);

  categorias: { value: AdminCatNoticia | 'todas'; label: string }[] = [
    { value: 'todas',    label: 'Todas' },
    { value: 'paroquia', label: 'Paróquia' },
    { value: 'diocese',  label: 'Diocese' },
    { value: 'social',   label: 'Social' },
    { value: 'liturgia', label: 'Liturgia' },
    { value: 'formacao', label: 'Formação' }
  ];

  lista = computed(() => {
    const cat = this.filtroCategoria();
    const items = this.svc.items();
    return cat === 'todas' ? items : items.filter(n => n.categoria === cat);
  });

  setFiltro(cat: AdminCatNoticia | 'todas'): void { this.filtroCategoria.set(cat); }

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

  labelCategoria(cat: AdminCatNoticia): string { return this.svc.labelCategoria(cat); }
}
