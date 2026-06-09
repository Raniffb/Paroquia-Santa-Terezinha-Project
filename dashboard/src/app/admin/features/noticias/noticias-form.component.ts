import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AdminNoticiasService } from '../../core/services/admin-noticias.service';
import { AdminCatNoticia } from '../../core/models/admin.models';

@Component({
  selector: 'app-noticias-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './noticias-form.component.html',
  styleUrl: './noticias-form.component.scss'
})
export class NoticiasFormComponent implements OnInit {
  private fb     = inject(FormBuilder);
  private svc    = inject(AdminNoticiasService);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  editId     = signal<number | null>(null);
  salvo      = signal(false);
  carregando = signal(false);
  erro       = signal<string | null>(null);

  categorias: { value: AdminCatNoticia; label: string }[] = [
    { value: 'paroquia', label: 'Paróquia' },
    { value: 'diocese',  label: 'Diocese' },
    { value: 'social',   label: 'Social' },
    { value: 'liturgia', label: 'Liturgia' },
    { value: 'formacao', label: 'Formação' }
  ];

  form = this.fb.group({
    titulo:    ['', [Validators.required, Validators.maxLength(120)]],
    data:      ['', [Validators.required]],
    categoria: ['paroquia' as AdminCatNoticia, [Validators.required]],
    autor:     ['', [Validators.required, Validators.maxLength(60)]],
    resumo:    ['', [Validators.required, Validators.maxLength(300)]],
    corpo:     ['', [Validators.required]],
    destaque:  [false],
    publicado: [false]
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
          autor: item.autor, resumo: item.resumo, corpo: item.corpo,
          destaque: item.destaque, publicado: item.publicado
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
        setTimeout(() => this.router.navigate(['/admin/noticias']), 800);
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
