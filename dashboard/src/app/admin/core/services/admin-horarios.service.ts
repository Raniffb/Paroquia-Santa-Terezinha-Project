import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { AdminConfissao, AdminMissa, AdminObservacao, AdminSacramento } from '../models/admin.models';
import { environment } from '../../../../environments/environment';

const BASE_MISSAS      = `${environment.apiUrl}/mass-schedules`;
const BASE_SACRAMENTOS = `${environment.apiUrl}/sacramentos`;
const BASE_INFO        = `${environment.apiUrl}/horarios-info`;

interface ApiMassa       { id: number; day: string; times: string; }
interface ApiSacramento  { id: number; title: string; description: string; icon: string; sortOrder: number; }
interface ApiHorariosInfo { id: number; title: string; description: string; sortOrder: number; }

function toAdminMissa(r: ApiMassa): AdminMissa {
  return { id: r.id, dia: r.day, horarios: r.times ? r.times.split(',').filter(Boolean) : [] };
}

function toAdminSacramento(r: ApiSacramento): AdminSacramento {
  return { id: r.id, titulo: r.title, descricao: r.description, icone: r.icon };
}

function toAdminInfo(r: ApiHorariosInfo): AdminObservacao {
  return { id: r.id, titulo: r.title, descricao: r.description };
}

const SEED_CONFISSOES: AdminConfissao[] = [
  { id: 1, dia: 'Sábado',  horario: '17h00 às 17h45' },
  { id: 2, dia: 'Domingo', horario: '08h00 às 08h45' },
];

@Injectable({ providedIn: 'root' })
export class AdminHorariosService {
  private http = inject(HttpClient);

  private _missas      = signal<AdminMissa[]>([]);
  private _sacramentos = signal<AdminSacramento[]>([]);
  private _confissoes  = signal<AdminConfissao[]>(SEED_CONFISSOES.map(c => ({ ...c })));
  private _observacoes = signal<AdminObservacao[]>([]);

  readonly missas      = this._missas.asReadonly();
  readonly sacramentos = this._sacramentos.asReadonly();
  readonly confissoes  = this._confissoes.asReadonly();
  readonly observacoes = this._observacoes.asReadonly();

  constructor() {
    this.carregarMissas();
    this.carregarSacramentos();
    this.carregarHorariosInfo();
  }

  // ── Missas (API) ─────────────────────────────────────────────────────────────

  carregarMissas(): void {
    this.http.get<ApiMassa[]>(BASE_MISSAS).subscribe({
      next: data => this._missas.set(data.map(toAdminMissa)),
      error: () => {}
    });
  }

  getMissaById(id: number): AdminMissa | undefined {
    return this._missas().find(m => m.id === id);
  }

  updateMissa(id: number, horarios: string[]): Observable<void> {
    const times = horarios.filter(h => h.trim()).join(',');
    return this.http.patch<ApiMassa>(`${BASE_MISSAS}/${id}`, { times }).pipe(
      tap(r => this._missas.update(l => l.map(m => m.id === id ? toAdminMissa(r) : m))),
      map(() => void 0)
    );
  }

  // ── Sacramentos (API) ─────────────────────────────────────────────────────────

  carregarSacramentos(): void {
    this.http.get<ApiSacramento[]>(BASE_SACRAMENTOS).subscribe({
      next: data => this._sacramentos.set(data.map(toAdminSacramento)),
      error: () => {}
    });
  }

  createSacramento(titulo: string, descricao: string, icone: string): Observable<AdminSacramento> {
    return this.http.post<ApiSacramento>(BASE_SACRAMENTOS, {
      title: titulo, description: descricao, icon: icone,
    }).pipe(
      tap(r => this._sacramentos.update(l => [...l, toAdminSacramento(r)])),
      map(toAdminSacramento)
    );
  }

  updateSacramento(id: number, titulo: string, descricao: string, icone: string): Observable<void> {
    return this.http.patch<ApiSacramento>(`${BASE_SACRAMENTOS}/${id}`, {
      title: titulo, description: descricao, icon: icone,
    }).pipe(
      tap(r => this._sacramentos.update(l => l.map(s => s.id === id ? toAdminSacramento(r) : s))),
      map(() => void 0)
    );
  }

  deleteSacramento(id: number): void {
    this.http.delete(`${BASE_SACRAMENTOS}/${id}`).subscribe({
      next: () => this._sacramentos.update(l => l.filter(s => s.id !== id)),
      error: () => {}
    });
  }

  // ── Confissões (local) ────────────────────────────────────────────────────────

  getConfissaoById(id: number): AdminConfissao | undefined {
    return this._confissoes().find(c => c.id === id);
  }

  updateConfissao(id: number, horario: string): boolean {
    if (!this._confissoes().some(c => c.id === id)) return false;
    this._confissoes.update(l => l.map(c => c.id === id ? { ...c, horario } : c));
    return true;
  }

  createConfissao(dia: string, horario: string): AdminConfissao {
    const item: AdminConfissao = { id: Date.now(), dia, horario };
    this._confissoes.update(l => [...l, item]);
    return item;
  }

  deleteConfissao(id: number): boolean {
    if (!this._confissoes().some(c => c.id === id)) return false;
    this._confissoes.update(l => l.filter(c => c.id !== id));
    return true;
  }

  // ── Informações Importantes (API) ─────────────────────────────────────────────

  carregarHorariosInfo(): void {
    this.http.get<ApiHorariosInfo[]>(BASE_INFO).subscribe({
      next: data => this._observacoes.set(data.map(toAdminInfo)),
      error: () => {}
    });
  }

  getObservacaoById(id: number): AdminObservacao | undefined {
    return this._observacoes().find(o => o.id === id);
  }

  createObservacao(titulo: string, descricao: string): Observable<AdminObservacao> {
    return this.http.post<ApiHorariosInfo>(BASE_INFO, {
      title: titulo, description: descricao,
    }).pipe(
      tap(r => this._observacoes.update(l => [...l, toAdminInfo(r)])),
      map(toAdminInfo)
    );
  }

  updateObservacao(id: number, titulo: string, descricao: string): Observable<void> {
    return this.http.patch<ApiHorariosInfo>(`${BASE_INFO}/${id}`, {
      title: titulo, description: descricao,
    }).pipe(
      tap(r => this._observacoes.update(l => l.map(o => o.id === id ? toAdminInfo(r) : o))),
      map(() => void 0)
    );
  }

  deleteObservacao(id: number): void {
    this.http.delete(`${BASE_INFO}/${id}`).subscribe({
      next: () => this._observacoes.update(l => l.filter(o => o.id !== id)),
      error: () => {}
    });
  }
}
