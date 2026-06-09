import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AdminAvisosService } from '../../core/services/admin-avisos.service';
import { AdminCatAviso } from '../../core/models/admin.models';

@Component({
  selector: 'app-avisos-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './avisos-form.component.html',
  styleUrl: './avisos-form.component.scss'
})
export class AvisosFormComponent implements OnInit {
  private fb     = inject(FormBuilder);
  private svc    = inject(AdminAvisosService);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  editId = signal<number | null>(null);
  salvo  = signal(false);

  categorias: { value: AdminCatAviso; label: string }[] = [
    { value: 'liturgia',       label: 'Liturgia' },
    { value: 'comunidade',     label: 'Comunidade' },
    { value: 'administrativo', label: 'Administrativo' },
    { value: 'formacao',       label: 'Formação' },
    { value: 'social',         label: 'Social' },
    { value: 'geral',          label: 'Geral' }
  ];

  form = this.fb.group({
    titulo:    ['', [Validators.required, Validators.maxLength(120)]],
    data:      ['', [Validators.required]],
    categoria: ['geral' as AdminCatAviso, [Validators.required]],
    resumo:    ['', [Validators.required, Validators.maxLength(300)]],
    urgente:   [false],
    ativo:     [true]
  });

  get modoEdicao(): boolean { return this.editId() !== null; }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      const item = this.svc.getById(id);
      if (item) {
        this.editId.set(id);
        this.form.patchValue(item);
      }
    }
  }

  salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value as any;

    if (this.modoEdicao) {
      this.svc.update(this.editId()!, v);
    } else {
      this.svc.create(v);
    }

    this.salvo.set(true);
    setTimeout(() => this.router.navigate(['/admin/avisos']), 800);
  }

  f(campo: string) { return this.form.get(campo)!; }
  err(campo: string): boolean { return this.f(campo).invalid && this.f(campo).touched; }
}
