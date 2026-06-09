import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  erro         = signal<string | null>(null);
  carregando   = signal(false);
  mostrarSenha = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]]
  });

  constructor() {
    // Exibe mensagem quando o interceptor redireciona por sessão expirada
    if (this.route.snapshot.queryParamMap.get('sessao') === 'expirada') {
      this.erro.set('Sua sessão expirou. Faça login novamente.');
    }
  }

  toggleSenha(): void { this.mostrarSenha.update(v => !v); }

  entrar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.erro.set(null);
    this.carregando.set(true);

    const { email, senha } = this.form.value;
    this.auth.login(email!, senha!).subscribe({
      next: ok => {
        this.carregando.set(false);
        if (ok) {
          this.router.navigate(['/admin']);
        } else {
          this.erro.set('E-mail ou senha inválidos.');
        }
      },
      error: () => {
        this.carregando.set(false);
        this.erro.set('Serviço indisponível. Tente novamente em instantes.');
      }
    });
  }

  get campoEmail() { return this.form.get('email')!; }
  get campoSenha() { return this.form.get('senha')!; }
}
