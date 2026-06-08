import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ParishService } from '../../../../core/services/parish.service';
import { Aviso } from '../../../../core/models/parish.models';

@Component({
  selector: 'app-avisos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './avisos.component.html',
  styleUrl: './avisos.component.scss'
})
export class AvisosComponent implements OnInit {
  private service = inject(ParishService);
  avisos: Aviso[] = [];

  ngOnInit(): void {
    this.service.getAvisos().subscribe(a => this.avisos = a.slice(0, 4));
  }

  formatarData(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short'
    });
  }
}
