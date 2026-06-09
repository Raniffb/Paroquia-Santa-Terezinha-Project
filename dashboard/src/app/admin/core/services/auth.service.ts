import { Injectable, signal } from '@angular/core';

const TOKEN_KEY = 'pst_admin_auth';
const CREDENCIAIS = { usuario: 'admin', senha: 'admin123' };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _loggedIn = signal<boolean>(this.checkStored());

  readonly isLoggedIn = this._loggedIn.asReadonly();
  readonly nomeUsuario = CREDENCIAIS.usuario;

  login(usuario: string, senha: string): boolean {
    if (usuario === CREDENCIAIS.usuario && senha === CREDENCIAIS.senha) {
      try { localStorage.setItem(TOKEN_KEY, 'mock-ok'); } catch { /* ignore */ }
      this._loggedIn.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
    this._loggedIn.set(false);
  }

  private checkStored(): boolean {
    try { return !!localStorage.getItem(TOKEN_KEY); } catch { return false; }
  }
}
