import { Injectable, signal } from '@angular/core';
import { AdminAviso, AdminCatAviso } from '../models/admin.models';

const SEED: AdminAviso[] = [
  { id: 1, ativo: true, urgente: false, categoria: 'liturgia',       titulo: 'Festa de Santa Teresinha – 1º de outubro', data: '2026-10-01', resumo: 'Programação especial com missa solene, procissão e apresentações culturais.' },
  { id: 2, ativo: true, urgente: true,  categoria: 'social',         titulo: 'Campanha do Agasalho 2026',                data: '2026-06-01', resumo: 'Arrecadação de roupas e cobertores para famílias carentes. Entrega até 30 de junho.' },
  { id: 3, ativo: true, urgente: false, categoria: 'formacao',       titulo: 'Primeira Comunhão – Inscrições Abertas',   data: '2026-05-20', resumo: 'Crianças a partir de 9 anos. Curso preparatório às quartas-feiras, das 18h às 19h30.' },
  { id: 4, ativo: true, urgente: false, categoria: 'formacao',       titulo: 'Retiro Espiritual para Adultos',            data: '2026-05-15', resumo: 'Dias 12 e 13 de julho no Sítio Esperança. Vagas limitadas a 40 participantes.' },
  { id: 5, ativo: true, urgente: false, categoria: 'administrativo', titulo: 'Reunião do Conselho Paroquial',             data: '2026-06-05', resumo: 'Reunião ordinária do Conselho Paroquial Financeiro e Pastoral.' },
  { id: 6, ativo: true, urgente: false, categoria: 'comunidade',     titulo: 'Grupo Jovem – Novos Integrantes',           data: '2026-06-03', resumo: 'O Grupo Jovem está com inscrições abertas para jovens de 15 a 30 anos.' },
  { id: 7, ativo: true, urgente: false, categoria: 'administrativo', titulo: 'Secretaria Paroquial – Novo Horário',       data: '2026-06-01', resumo: 'A partir de julho, a secretaria funcionará de segunda a sexta, das 7h30 às 17h.' }
];

@Injectable({ providedIn: 'root' })
export class AdminAvisosService {
  private _items = signal<AdminAviso[]>(SEED.map(a => ({ ...a })));
  readonly items = this._items.asReadonly();

  getAll(): AdminAviso[] { return this._items(); }

  getById(id: number): AdminAviso | undefined {
    return this._items().find(a => a.id === id);
  }

  create(data: Omit<AdminAviso, 'id'>): AdminAviso {
    const item: AdminAviso = { ...data, id: Date.now() };
    this._items.update(list => [item, ...list]);
    return item;
  }

  update(id: number, data: Omit<AdminAviso, 'id'>): boolean {
    if (!this._items().some(a => a.id === id)) return false;
    this._items.update(list => list.map(a => a.id === id ? { ...data, id } : a));
    return true;
  }

  delete(id: number): boolean {
    if (!this._items().some(a => a.id === id)) return false;
    this._items.update(list => list.filter(a => a.id !== id));
    return true;
  }

  labelCategoria(cat: AdminCatAviso): string {
    const map: Record<AdminCatAviso, string> = {
      liturgia: 'Liturgia', comunidade: 'Comunidade', administrativo: 'Administrativo',
      formacao: 'Formação', social: 'Social', geral: 'Geral'
    };
    return map[cat];
  }
}
