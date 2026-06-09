import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

const TOKEN_KEY = 'pst_admin_token';
const NAME_KEY  = 'pst_admin_name';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private _loggedIn     = signal<boolean>(this.checkStored());
  private _nomeUsuario  = signal<string>(this.getStoredName());

  readonly isLoggedIn   = this._loggedIn.asReadonly();
  readonly nomeUsuario  = this._nomeUsuario.asReadonly();

  login(email: string, senha: string): Observable<boolean> {
    return this.http
      .post<{ access_token: string; user: { id: number; name: string; email: string } }>(
        `${environment.apiUrl}/auth/login`,
        { email, password: senha }
      )
      .pipe(
        map(res => {
          try {
            localStorage.setItem(TOKEN_KEY, res.access_token);
            localStorage.setItem(NAME_KEY, res.user.name);
          } catch { /* ignore */ }
          this._loggedIn.set(true);
          this._nomeUsuario.set(res.user.name);
          return true;
        }),
        catchError((err: HttpErrorResponse) => {
          // Credenciais inválidas — o formulário exibe a mensagem adequada
          if (err.status === 401 || err.status === 400) return of(false);
          // Erro de rede ou servidor (status 0, 5xx) — propaga para o componente
          // exibir "serviço indisponível" em vez de "senha inválida"
          return throwError(() => err);
        })
      );
  }

  logout(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(NAME_KEY);
    } catch { /* ignore */ }
    this._loggedIn.set(false);
    this._nomeUsuario.set('');
  }

  private checkStored(): boolean {
    try { return !!localStorage.getItem(TOKEN_KEY); } catch { return false; }
  }

  private getStoredName(): string {
    try { return localStorage.getItem(NAME_KEY) ?? 'Administrador'; } catch { return 'Administrador'; }
  }
}
