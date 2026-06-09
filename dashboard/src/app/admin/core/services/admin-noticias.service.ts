import { Injectable, signal } from '@angular/core';
import { AdminCatNoticia, AdminNoticia } from '../models/admin.models';

const SEED: AdminNoticia[] = [
  {
    id: 1, publicado: true, destaque: true,
    titulo: 'Paróquia recebe título de Patrimônio Cultural Imaterial de Manaus',
    data: '2026-06-01', categoria: 'paroquia', autor: 'Secretaria Paroquial',
    resumo: 'A Câmara Municipal de Manaus aprovou, em sessão solene, o título de Patrimônio Cultural Imaterial para a Paróquia Santa Teresinha.',
    corpo: 'A Câmara Municipal de Manaus aprovou por unanimidade, em sessão solene realizada na última terça-feira, o título de Patrimônio Cultural Imaterial de Manaus para a Paróquia Santa Teresinha. O reconhecimento celebra os 60 anos de história da paróquia, que desde 1966 serve à comunidade do bairro Aleixo e adjacências.'
  },
  {
    id: 2, publicado: true, destaque: false,
    titulo: 'Diocese lança campanha de solidariedade às vítimas das chuvas',
    data: '2026-05-28', categoria: 'diocese', autor: 'Comunicação Diocesana',
    resumo: 'Em resposta às enchentes que afetaram comunidades ribeirinhas do Amazonas, a Diocese de Manaus lançou uma campanha emergencial.',
    corpo: 'A Diocese de Manaus, em parceria com a Cáritas Diocesana, lança a Campanha Solidária pelas Famílias do Amazonas. A Paróquia Santa Teresinha é um dos pontos de coleta em Manaus.'
  },
  {
    id: 3, publicado: true, destaque: false,
    titulo: 'Projeto "Sopa Quente" completa dois anos de atividade ininterrupta',
    data: '2026-05-20', categoria: 'social', autor: 'Pastoral da Caridade',
    resumo: 'O projeto social completa dois anos, tendo servido mais de 20 mil refeições a pessoas em situação de vulnerabilidade.',
    corpo: 'Toda segunda-feira, às 18h, um grupo de voluntários se reúne para preparar e servir sopa, pão e suco. O projeto "Sopa Quente" completou dois anos de funcionamento ininterrupto neste mês de maio.'
  },
  {
    id: 4, publicado: true, destaque: false,
    titulo: 'Semana Litúrgica: triduo em honra a Santa Teresinha',
    data: '2026-05-10', categoria: 'liturgia', autor: 'Secretaria Paroquial',
    resumo: 'Nos dias 29 de setembro a 1º de outubro, a paróquia celebra o Triduo em honra à padroeira.',
    corpo: 'A Semana Litúrgica em honra a Santa Teresinha do Menino Jesus acontece entre os dias 29 de setembro e 1º de outubro. A programação inclui missas solenes às 19h nos três dias.'
  }
];

@Injectable({ providedIn: 'root' })
export class AdminNoticiasService {
  private _items = signal<AdminNoticia[]>(SEED.map(n => ({ ...n })));
  readonly items = this._items.asReadonly();

  getAll(): AdminNoticia[] { return this._items(); }

  getById(id: number): AdminNoticia | undefined {
    return this._items().find(n => n.id === id);
  }

  create(data: Omit<AdminNoticia, 'id'>): AdminNoticia {
    const item: AdminNoticia = { ...data, id: Date.now() };
    this._items.update(list => [item, ...list]);
    return item;
  }

  update(id: number, data: Omit<AdminNoticia, 'id'>): boolean {
    if (!this._items().some(n => n.id === id)) return false;
    this._items.update(list => list.map(n => n.id === id ? { ...data, id } : n));
    return true;
  }

  delete(id: number): boolean {
    if (!this._items().some(n => n.id === id)) return false;
    this._items.update(list => list.filter(n => n.id !== id));
    return true;
  }

  labelCategoria(cat: AdminCatNoticia): string {
    const map: Record<AdminCatNoticia, string> = {
      paroquia: 'Paróquia', diocese: 'Diocese',
      social: 'Social', liturgia: 'Liturgia', formacao: 'Formação'
    };
    return map[cat];
  }
}
