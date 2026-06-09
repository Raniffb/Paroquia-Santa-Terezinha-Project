import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParishService } from '../../../../core/services/parish.service';
import { Missa } from '../../../../core/models/parish.models';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.scss'
})
export class HorariosComponent implements OnInit {
  private service = inject(ParishService);
  missas: Missa[] = [];

  ngOnInit(): void {
    this.service.getMissas().subscribe(m => this.missas = m);
  }
}
