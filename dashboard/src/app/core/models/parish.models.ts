// ── Avisos ───────────────────────────────────────────────────────────────────

export type CategoriaAviso =
  | 'liturgia'
  | 'comunidade'
  | 'administrativo'
  | 'formacao'
  | 'social'
  | 'geral';

export interface Aviso {
  id: number;
  titulo: string;
  resumo: string;
  corpo: string;
  data: string;
  destaque?: boolean;
  urgente?: boolean;
  featured?: boolean;
  categoria?: CategoriaAviso;
}

// ── Notícias ──────────────────────────────────────────────────────────────────

export type CategoriaNoticia =
  | 'paroquia'
  | 'diocese'
  | 'social'
  | 'liturgia'
  | 'formacao';

export interface Noticia {
  id: number;
  titulo: string;
  resumo: string;
  corpo: string;
  data: string;
  categoria: CategoriaNoticia;
  autor?: string;
}

// ── Missas / Horários ─────────────────────────────────────────────────────────

export interface Missa {
  dia: string;
  horarios: string[];
}

export interface Confissao {
  dia: string;
  horario: string;
}

export interface ObservacaoMissa {
  id: number;
  titulo: string;
  descricao: string;
}

export interface Sacramento {
  id: number;
  titulo: string;
  descricao: string;
  icone: string;
}

// ── Eventos ───────────────────────────────────────────────────────────────────

export type CategoriaEvento =
  | 'missa'
  | 'encontro'
  | 'retiro'
  | 'festivo'
  | 'formacao'
  | 'social';

export interface Evento {
  id: number;
  titulo: string;
  local: string;
  data: string;
  diaSemana: string;
  dia: string;
  mes: string;
  ano: string;
  hora?: string;
  categoria: CategoriaEvento;
  resumo?: string;
  descricao?: string;
  featured?: boolean;
}

// ── Destaque (carrossel home) ──────────────────────────────────────────────────

export type TipoDestaque = 'aviso' | 'noticia' | 'evento';

export interface ItemDestaque {
  tipo: TipoDestaque;
  id: number;
  titulo: string;
  resumo: string;
  data: string;
  urgente?: boolean;
  rota: string;
  extra?: string; // local (evento) ou categoria formatada
}

// ── Contato ───────────────────────────────────────────────────────────────────

export interface ContatoInfo {
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep?: string;
  telefones: string[];
  email: string;
  horariosSecretaria: { dias: string; horas: string }[];
}
