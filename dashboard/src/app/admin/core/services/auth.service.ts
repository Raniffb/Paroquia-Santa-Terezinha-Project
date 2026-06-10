import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export const NAME_KEY = 'pst_admin_name';

// O token JWT nunca toca o localStorage — fica exclusivamente no cookie HttpOnly.
// Aqui guardamos apenas o nome do usuário para personalizar a interface.

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private _loggedIn    = signal<boolean>(this.checkStored());
  private _nomeUsuario = signal<string>(this.getStoredName());

  readonly isLoggedIn  = this._loggedIn.asReadonly();
  readonly nomeUsuario = this._nomeUsuario.asReadonly();

  login(email: string, senha: string): Observable<boolean> {
    return this.http
      .post<{ user: { id: number; name: string; email: string } }>(
        `${environment.apiUrl}/auth/login`,
        { email, password: senha },
        { withCredentials: true },
      )
      .pipe(
        map(res => {
          try {
            // Salva apenas o nome para exibição — nunca o token
            localStorage.setItem(NAME_KEY, res.user.name);
          } catch { /* ignore */ }
          this._loggedIn.set(true);
          this._nomeUsuario.set(res.user.name);
          return true;
        }),
        catchError((err: HttpErrorResponse) => {
          // Credenciais inválidas — exibe mensagem no formulário
          if (err.status === 401 || err.status === 400) return of(false);
          // Erro de rede ou servidor — propaga para exibir "serviço indisponível"
          return throwError(() => err);
        }),
      );
  }

  logout(): void {
    // Pede ao backend para limpar o cookie HttpOnly (só o servidor pode fazer isso)
    this.http
      .post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(catchError(() => of(null)))
      .subscribe();

    try { localStorage.removeItem(NAME_KEY); } catch { /* ignore */ }
    this._loggedIn.set(false);
    this._nomeUsuario.set('');
  }

  // Chamado pelo APP_INITIALIZER: verifica se o cookie JWT ainda é válido.
  // Se não for, limpa o estado local silenciosamente (sem redirecionar).
  // O authGuard cuidará do redirecionamento quando o usuário acessar rota protegida.
  init(): Observable<void> {
    if (!this._loggedIn()) return of(undefined);
    return this.http
      .get<{ id: number; email: string }>(`${environment.apiUrl}/auth/profile`, { withCredentials: true })
      .pipe(
        map(() => undefined),
        catchError(() => {
          try { localStorage.removeItem(NAME_KEY); } catch { /* ignore */ }
          this._loggedIn.set(false);
          this._nomeUsuario.set('');
          return of(undefined);
        })
      );
  }

  private checkStored(): boolean {
    try { return !!localStorage.getItem(NAME_KEY); } catch { return false; }
  }

  private getStoredName(): string {
    try { return localStorage.getItem(NAME_KEY) ?? 'Administrador'; } catch { return 'Administrador'; }
  }
}
