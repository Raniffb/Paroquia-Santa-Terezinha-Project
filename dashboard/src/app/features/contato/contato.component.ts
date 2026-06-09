import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms';
import { ParishService } from '../../core/services/parish.service';
import { ContatoInfo } from '../../core/models/parish.models';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeroComponent],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.scss'
})
export class ContatoComponent implements OnInit {
  private service = inject(ParishService);
  private fb = inject(FormBuilder);

  info: ContatoInfo | null = null;
  enviando = false;
  feedbackSucesso = false;
  feedbackErro = false;

  assuntos = [
    'Informações gerais',
    'Sacramentos (Batismo, Casamento, etc.)',
    'Horários e celebrações',
    'Grupos e pastorais',
    'Retiros e eventos',
    'Doações e contribuições',
    'Outros'
  ];

  form = this.fb.group({
    nome:     ['', [Validators.required, Validators.minLength(3)]],
    email:    ['', [Validators.required, Validators.email]],
    telefone: [''],
    assunto:  ['', Validators.required],
    mensagem: ['', [Validators.required, Validators.minLength(15)]]
  });

  ngOnInit(): void {
    this.service.getContatoInfo().subscribe(i => this.info = i);
  }

  campo(nome: string): AbstractControl {
    return this.form.get(nome)!;
  }

  erroVisivel(nome: string): boolean {
    const c = this.campo(nome);
    return c.invalid && (c.dirty || c.touched);
  }

  mensagemErro(nome: string): string {
    const c = this.campo(nome);
    if (!c.errors) return '';
    if (c.errors['required'])   return 'Campo obrigatório.';
    if (c.errors['email'])      return 'E-mail inválido.';
    if (c.errors['minlength']) {
      const req = c.errors['minlength'].requiredLength;
      return `Mínimo de ${req} caracteres.`;
    }
    return 'Campo inválido.';
  }

  telHref(telefone: string): string {
    return 'tel:+55' + telefone.replace(/\D/g, '');
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando = true;
    this.feedbackSucesso = false;
    this.feedbackErro = false;

    const dados = {
      nome:     this.form.value.nome ?? '',
      email:    this.form.value.email ?? '',
      telefone: this.form.value.telefone ?? '',
      assunto:  this.form.value.assunto ?? '',
      mensagem: this.form.value.mensagem ?? ''
    };

    this.service.enviarMensagem(dados).subscribe({
      next: () => {
        this.enviando = false;
        this.feedbackSucesso = true;
        this.form.reset();
      },
      error: () => {
        this.enviando = false;
        this.feedbackErro = true;
      }
    });
  }
}
