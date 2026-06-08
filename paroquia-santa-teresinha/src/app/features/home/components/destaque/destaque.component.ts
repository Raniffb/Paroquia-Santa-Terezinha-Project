import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParishService } from '../../../../core/services/parish.service';
import { Aviso } from '../../../../core/models/parish.models';

@Component({
  selector: 'app-destaque',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './destaque.component.html',
  styleUrl: './destaque.component.scss'
})
export class DestaqueComponent implements OnInit {
  private service = inject(ParishService);
  aviso: Aviso | null = null;

  ngOnInit(): void {
    this.service.getAvisoDestaque().subscribe(a => this.aviso = a);
  }

  formatarData(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }
}
