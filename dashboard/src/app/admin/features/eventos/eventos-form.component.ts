import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AdminEventosService } from '../../core/services/admin-eventos.service';
import { AdminCatEvento } from '../../core/models/admin.models';

@Component({
  selector: 'app-eventos-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './eventos-form.component.html',
  styleUrl: './eventos-form.component.scss'
})
export class EventosFormComponent implements OnInit {
  private fb     = inject(FormBuilder);
  private svc    = inject(AdminEventosService);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  editId     = signal<number | null>(null);
  salvo      = signal(false);
  carregando = signal(false);
  erro       = signal<string | null>(null);

  categorias: { value: AdminCatEvento; label: string }[] = [
    { value: 'missa',    label: 'Missa' },
    { value: 'encontro', label: 'Encontro' },
    { value: 'retiro',   label: 'Retiro' },
    { value: 'festivo',  label: 'Festivo' },
    { value: 'formacao', label: 'Formação' },
    { value: 'social',   label: 'Social' }
  ];

  form = this.fb.group({
    titulo:   ['', [Validators.required, Validators.maxLength(120)]],
    data:     ['', [Validators.required]],
    hora:     ['', [Validators.required, Validators.pattern(/^\d{2}h\d{2}$/)]],
    local:    ['', [Validators.required, Validators.maxLength(100)]],
    categoria:['encontro' as AdminCatEvento, [Validators.required]],
    descricao:['', [Validators.required]],
    publicado:[false],
    destaque: [false]
  });

  get modoEdicao(): boolean { return this.editId() !== null; }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.svc.getById(id).subscribe(item => {
      if (item) {
        this.editId.set(id);
        this.form.patchValue({
          titulo: item.titulo, data: item.data, hora: item.hora,
          local: item.local, categoria: item.categoria,
          descricao: item.descricao, publicado: item.publicado,
          destaque: item.destaque
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
        setTimeout(() => this.router.navigate(['/admin/eventos']), 800);
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
