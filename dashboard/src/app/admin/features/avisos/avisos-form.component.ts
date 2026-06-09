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

  editId     = signal<number | null>(null);
  salvo      = signal(false);
  carregando = signal(false);
  erro       = signal<string | null>(null);

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
    if (!id) return;

    this.svc.getById(id).subscribe(item => {
      if (item) {
        this.editId.set(id);
        this.form.patchValue({
          titulo: item.titulo, data: item.data, categoria: item.categoria,
          resumo: item.resumo, urgente: item.urgente, ativo: item.ativo
        });
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.erro.set(null);
    this.carregando.set(true);
    const v = this.form.value as any;

    const op = this.modoEdicao
      ? this.svc.update(this.editId()!, v)
      : this.svc.create(v);

    op.subscribe({
      next: () => {
        this.carregando.set(false);
        this.salvo.set(true);
        setTimeout(() => this.router.navigate(['/admin/avisos']), 800);
      },
      error: () => {
        this.carregando.set(false);
        this.erro.set('Erro ao salvar. Verifique os dados e tente novamente.');
      }
    });
  }

  f(campo: string) { return this.form.get(campo)!; }
  err(campo: string): boolean { return this.f(campo).invalid && this.f(campo).touched; }
}
