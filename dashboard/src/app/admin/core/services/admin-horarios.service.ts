import { Injectable, signal } from '@angular/core';
import { AdminConfissao, AdminMissa, AdminObservacao } from '../models/admin.models';

const SEED_MISSAS: AdminMissa[] = [
  { id: 1, dia: 'Segunda-feira',  horarios: ['07h00'] },
  { id: 2, dia: 'Terça-feira',    horarios: ['07h00'] },
  { id: 3, dia: 'Quarta-feira',   horarios: ['07h00', '19h00'] },
  { id: 4, dia: 'Quinta-feira',   horarios: ['07h00'] },
  { id: 5, dia: 'Sexta-feira',    horarios: ['07h00', '19h00'] },
  { id: 6, dia: 'Sábado',         horarios: ['07h00', '18h00'] },
  { id: 7, dia: 'Domingo',        horarios: ['07h00', '09h00', '11h00', '18h00'] }
];

const SEED_CONFISSOES: AdminConfissao[] = [
  { id: 1, dia: 'Sábado',  horario: '17h00 às 17h45' },
  { id: 2, dia: 'Domingo', horario: '08h00 às 08h45' }
];

const SEED_OBSERVACOES: AdminObservacao[] = [
  { id: 1, titulo: 'Missas especiais',         descricao: 'Em datas festivas podem ser celebradas missas adicionais. Consulte o mural da paróquia.' },
  { id: 2, titulo: 'Horários de Natal e Páscoa', descricao: 'Os horários de Natal e Páscoa são divulgados com antecedência no site e no mural da paróquia.' }
];

@Injectable({ providedIn: 'root' })
export class AdminHorariosService {
  private _missas      = signal<AdminMissa[]>(SEED_MISSAS.map(m => ({ ...m, horarios: [...m.horarios] })));
  private _confissoes  = signal<AdminConfissao[]>(SEED_CONFISSOES.map(c => ({ ...c })));
  private _observacoes = signal<AdminObservacao[]>(SEED_OBSERVACOES.map(o => ({ ...o })));

  readonly missas      = this._missas.asReadonly();
  readonly confissoes  = this._confissoes.asReadonly();
  readonly observacoes = this._observacoes.asReadonly();

  // ── Missas ──────────────────────────────────────────────────────────────────
  getMissaById(id: number): AdminMissa | undefined {
    return this._missas().find(m => m.id === id);
  }

  updateMissa(id: number, horarios: string[]): boolean {
    if (!this._missas().some(m => m.id === id)) return false;
    this._missas.update(list => list.map(m => m.id === id ? { ...m, horarios: [...horarios] } : m));
    return true;
  }

  // ── Confissões ──────────────────────────────────────────────────────────────
  getConfissaoById(id: number): AdminConfissao | undefined {
    return this._confissoes().find(c => c.id === id);
  }

  updateConfissao(id: number, horario: string): boolean {
    if (!this._confissoes().some(c => c.id === id)) return false;
    this._confissoes.update(list => list.map(c => c.id === id ? { ...c, horario } : c));
    return true;
  }

  createConfissao(dia: string, horario: string): AdminConfissao {
    const item: AdminConfissao = { id: Date.now(), dia, horario };
    this._confissoes.update(list => [...list, item]);
    return item;
  }

  deleteConfissao(id: number): boolean {
    if (!this._confissoes().some(c => c.id === id)) return false;
    this._confissoes.update(list => list.filter(c => c.id !== id));
    return true;
  }

  // ── Observações ─────────────────────────────────────────────────────────────
  getObservacaoById(id: number): AdminObservacao | undefined {
    return this._observacoes().find(o => o.id === id);
  }

  updateObservacao(id: number, titulo: string, descricao: string): boolean {
    if (!this._observacoes().some(o => o.id === id)) return false;
    this._observacoes.update(list => list.map(o => o.id === id ? { ...o, titulo, descricao } : o));
    return true;
  }

  createObservacao(titulo: string, descricao: string): AdminObservacao {
    const item: AdminObservacao = { id: Date.now(), titulo, descricao };
    this._observacoes.update(list => [...list, item]);
    return item;
  }

  deleteObservacao(id: number): boolean {
    if (!this._observacoes().some(o => o.id === id)) return false;
    this._observacoes.update(list => list.filter(o => o.id !== id));
    return true;
  }
}
