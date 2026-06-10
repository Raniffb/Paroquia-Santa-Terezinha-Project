// ── Notícias ──────────────────────────────────────────────────────────────────
export type AdminCatNoticia = 'paroquia' | 'diocese' | 'social' | 'liturgia' | 'formacao';

export interface AdminNoticia {
  id: number;
  titulo: string;
  data: string;        // YYYY-MM-DD
  resumo: string;
  corpo: string;
  categoria: AdminCatNoticia;
  autor: string;
  destaque: boolean;
  publicado: boolean;
}

// ── Avisos ────────────────────────────────────────────────────────────────────
export type AdminCatAviso = 'liturgia' | 'comunidade' | 'administrativo' | 'formacao' | 'social' | 'geral';

export interface AdminAviso {
  id: number;
  titulo: string;
  data: string;
  resumo: string;
  corpo: string;
  categoria: AdminCatAviso;
  urgente: boolean;
  ativo: boolean;
  destaque: boolean;
}

// ── Eventos ───────────────────────────────────────────────────────────────────
export type AdminCatEvento = 'missa' | 'encontro' | 'retiro' | 'festivo' | 'formacao' | 'social';

export interface AdminEvento {
  id: number;
  titulo: string;
  data: string;        // YYYY-MM-DD
  hora: string;        // HHhMM
  local: string;
  resumo: string;
  descricao: string;
  categoria: AdminCatEvento;
  publicado: boolean;
  destaque: boolean;
}

// ── Horários ──────────────────────────────────────────────────────────────────
export interface AdminMissa {
  id: number;
  dia: string;
  horarios: string[];  // ['07h00', '19h00']
}

export interface AdminConfissao {
  id: number;
  dia: string;
  horario: string;
}

export interface AdminObservacao {
  id: number;
  titulo: string;
  descricao: string;
}

export interface AdminSacramento {
  id: number;
  titulo: string;
  descricao: string;
  icone: string;
}
