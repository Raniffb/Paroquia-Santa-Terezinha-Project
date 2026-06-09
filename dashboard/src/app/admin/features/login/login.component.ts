import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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

  erro         = signal<string | null>(null);
  carregando   = signal(false);
  mostrarSenha = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]]
  });

  toggleSenha(): void { this.mostrarSenha.update(v => !v); }

  entrar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.erro.set(null);
    this.carregando.set(true);

    const { email, senha } = this.form.value;
    this.auth.login(email!, senha!).subscribe(ok => {
      this.carregando.set(false);
      if (ok) {
        this.router.navigate(['/admin']);
      } else {
        this.erro.set('E-mail ou senha inválidos.');
      }
    });
  }

  get campoEmail() { return this.form.get('email')!; }
  get campoSenha() { return this.form.get('senha')!; }
}
