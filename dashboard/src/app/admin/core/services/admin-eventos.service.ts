import { Injectable, signal } from '@angular/core';
import { AdminCatEvento, AdminEvento } from '../models/admin.models';

const SEED: AdminEvento[] = [
  { id: 1,  publicado: true, categoria: 'encontro', titulo: 'Adoração ao Santíssimo',          data: '2026-06-12', hora: '18h00', local: 'Igreja Principal',        descricao: 'Hora santa com adoração ao Santíssimo Sacramento, canto e oração.' },
  { id: 2,  publicado: true, categoria: 'encontro', titulo: 'Grupo de Oração da Renovação',    data: '2026-06-14', hora: '16h00', local: 'Salão Paroquial',          descricao: 'Reunião quinzenal do Grupo de Oração da Renovação Carismática Católica.' },
  { id: 3,  publicado: true, categoria: 'retiro',   titulo: 'Retiro de Casais "ECC"',          data: '2026-06-20', hora: '08h00', local: 'Sítio Esperança – Iranduba', descricao: 'Retiro de um dia para casais, com dinâmicas, testemunhos e celebração.' },
  { id: 4,  publicado: true, categoria: 'missa',    titulo: 'Missa de São João',               data: '2026-06-24', hora: '19h00', local: 'Igreja Principal',        descricao: 'Missa em honra a São João Batista. Após, festa junina no pátio.' },
  { id: 5,  publicado: true, categoria: 'festivo',  titulo: 'Festa Junina Paroquial 2026',     data: '2026-06-27', hora: '17h00', local: 'Pátio da Igreja',          descricao: 'Animação ao vivo, comidas típicas, quadrilha e pescaria.' },
  { id: 6,  publicado: true, categoria: 'formacao', titulo: 'Catequese de Adultos – Início',   data: '2026-07-05', hora: '09h00', local: 'Salão Paroquial',          descricao: 'Início da catequese de adultos para quem deseja receber a Crisma.' },
  { id: 7,  publicado: true, categoria: 'retiro',   titulo: 'Retiro Espiritual para Adultos',  data: '2026-07-12', hora: '08h00', local: 'Sítio Esperança – Iranduba', descricao: 'Retiro de dois dias com tema "Silêncio e Oração".' },
  { id: 8,  publicado: true, categoria: 'festivo',  titulo: 'Festa de Santa Teresinha',        data: '2026-10-01', hora: '10h00', local: 'Igreja Principal',        descricao: 'Missa pontifical presidida pelo Bispo Diocesano, seguida de procissão.' }
];

@Injectable({ providedIn: 'root' })
export class AdminEventosService {
  private _items = signal<AdminEvento[]>(SEED.map(e => ({ ...e })));
  readonly items = this._items.asReadonly();

  getAll(): AdminEvento[] { return this._items(); }

  getById(id: number): AdminEvento | undefined {
    return this._items().find(e => e.id === id);
  }

  create(data: Omit<AdminEvento, 'id'>): AdminEvento {
    const item: AdminEvento = { ...data, id: Date.now() };
    this._items.update(list => [...list, item].sort((a, b) => a.data.localeCompare(b.data)));
    return item;
  }

  update(id: number, data: Omit<AdminEvento, 'id'>): boolean {
    if (!this._items().some(e => e.id === id)) return false;
    this._items.update(list =>
      list.map(e => e.id === id ? { ...data, id } : e)
          .sort((a, b) => a.data.localeCompare(b.data))
    );
    return true;
  }

  delete(id: number): boolean {
    if (!this._items().some(e => e.id === id)) return false;
    this._items.update(list => list.filter(e => e.id !== id));
    return true;
  }

  labelCategoria(cat: AdminCatEvento): string {
    const map: Record<AdminCatEvento, string> = {
      missa: 'Missa', encontro: 'Encontro', retiro: 'Retiro',
      festivo: 'Festivo', formacao: 'Formação', social: 'Social'
    };
    return map[cat];
  }

  formatarData(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
