import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';
import {
  Aviso,
  CategoriaAviso,
  Confissao,
  ContatoInfo,
  Evento,
  CategoriaEvento,
  ItemDestaque,
  Missa,
  Noticia,
  CategoriaNoticia,
  ObservacaoMissa,
  Sacramento
} from '../models/parish.models';
import { environment } from '../../../environments/environment';

// ── Tipos da API (backend usa campos em inglês) ───────────────────────────────

interface ApiNoticia {
  id: number; title: string; date: string; summary: string;
  content: string; category: string; author?: string; published: boolean; featured: boolean;
}

interface ApiAviso {
  id: number; title: string; date: string; description: string;
  priority: string; category: string; active: boolean; featured: boolean;
}

interface ApiEvento {
  id: number; title: string; date: string; time: string;
  location: string; description: string; category: string; published: boolean; featured: boolean;
}

interface ApiMassa       { id: number; day: string; times: string; }
interface ApiSacramento  { id: number; title: string; description: string; icon: string; sortOrder: number; }
interface ApiHorariosInfo { id: number; title: string; description: string; sortOrder: number; }

// ── Dados estáticos (sem endpoint no backend) ─────────────────────────────────

const CONFISSOES: Confissao[] = [
  { dia: 'Quarta-feira', horario: '18h00 às 18h45' },
  { dia: 'Sexta-feira',  horario: '18h00 às 18h45' },
  { dia: 'Sábado',       horario: '08h00 às 09h00 e 18h00 às 18h45' },
  { dia: 'Domingo',      horario: '08h00 às 08h45' }
];


const CONTATO_INFO: ContatoInfo = {
  endereco: 'Rua das Flores, 123',
  bairro: 'Aleixo',
  cidade: 'Manaus',
  estado: 'AM',
  cep: '69060-000',
  telefone: '(92) 1234-5678',
  email: 'contato@paroquiasantateresinha.com.br',
  horariosSecretaria: [
    { dias: 'Segunda a Sexta', horas: '08h00 às 12h00 e 14h00 às 17h00' },
    { dias: 'Sábado',          horas: '08h00 às 12h00' },
    { dias: 'Domingo',         horas: 'Após as missas das 9h e 11h' }
  ]
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const MESES_ABR   = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

function parseDateParts(isoDate: string) {
  const [y, m, d] = isoDate.split('T')[0].split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return {
    diaSemana: DIAS_SEMANA[date.getDay()],
    dia: String(d).padStart(2, '0'),
    mes: MESES_ABR[m - 1],
    ano: String(y)
  };
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ParishService {
  private http = inject(HttpClient);

  // ── Avisos ──────────────────────────────────────────────────────────────────

  getAvisoDestaque(): Observable<Aviso> {
    return this.http.get<ApiAviso[]>(`${environment.apiUrl}/notices`).pipe(
      map(items => {
        const ativos = items.filter(a => a.active).sort((a, b) => b.date.localeCompare(a.date));
        const urgente = ativos.find(a => a.priority === 'urgent') ?? ativos[0];
        return {
          id: urgente.id,
          titulo: urgente.title,
          resumo: urgente.description,
          data: urgente.date.split('T')[0],
          destaque: true,
          urgente: urgente.priority === 'urgent',
          categoria: urgente.category as CategoriaAviso
        };
      })
    );
  }

  getAvisos(categoria?: CategoriaAviso): Observable<Aviso[]> {
    return this.http.get<ApiAviso[]>(`${environment.apiUrl}/notices`).pipe(
      map(items => {
        let lista = items
          .filter(a => a.active)
          .map(a => ({
            id: a.id,
            titulo: a.title,
            resumo: a.description,
            data: a.date.split('T')[0],
            urgente: a.priority === 'urgent',
            featured: a.featured,
            categoria: a.category as CategoriaAviso
          }))
          .sort((a, b) => b.data.localeCompare(a.data));

        if (categoria) lista = lista.filter(a => a.categoria === categoria);
        return lista;
      })
    );
  }

  getAviso(id: number): Observable<Aviso> {
    return this.http.get<ApiAviso>(`${environment.apiUrl}/notices/${id}`).pipe(
      map(a => ({
        id: a.id,
        titulo: a.title,
        resumo: a.description,
        data: a.date.split('T')[0],
        urgente: a.priority === 'urgent',
        featured: a.featured,
        categoria: a.category as CategoriaAviso
      }))
    );
  }

  // ── Notícias ────────────────────────────────────────────────────────────────

  getNoticias(categoria?: CategoriaNoticia): Observable<Noticia[]> {
    return this.http.get<ApiNoticia[]>(`${environment.apiUrl}/news`).pipe(
      map(items => {
        let lista = items
          .filter(n => n.published)
          .map(n => ({
            id: n.id,
            titulo: n.title,
            resumo: n.summary,
            corpo: n.content,
            data: n.date.split('T')[0],
            categoria: n.category as CategoriaNoticia,
            autor: n.author
          }))
          .sort((a, b) => b.data.localeCompare(a.data));

        if (categoria) lista = lista.filter(n => n.categoria === categoria);
        return lista;
      })
    );
  }

  getNoticia(id: number): Observable<Noticia | undefined> {
    return this.http.get<ApiNoticia>(`${environment.apiUrl}/news/${id}`).pipe(
      map(n => ({
        id: n.id,
        titulo: n.title,
        resumo: n.summary,
        corpo: n.content,
        data: n.date.split('T')[0],
        categoria: n.category as CategoriaNoticia,
        autor: n.author
      }))
    );
  }

  // ── Destaques (carrossel home) ───────────────────────────────────────────────

  getDestaques(): Observable<ItemDestaque[]> {
    return forkJoin({
      avisos:   this.http.get<ApiAviso[]>(`${environment.apiUrl}/notices`),
      noticias: this.http.get<ApiNoticia[]>(`${environment.apiUrl}/news`),
      eventos:  this.http.get<ApiEvento[]>(`${environment.apiUrl}/events`),
    }).pipe(
      map(({ avisos, noticias, eventos }) => {
        const itens: ItemDestaque[] = [
          ...avisos
            .filter(a => a.active && a.featured)
            .map(a => ({
              tipo: 'aviso' as const,
              id: a.id,
              titulo: a.title,
              resumo: a.description,
              data: a.date.split('T')[0],
              urgente: a.priority === 'urgent',
              rota: `/avisos/${a.id}`,
            })),
          ...noticias
            .filter(n => n.published && n.featured)
            .map(n => ({
              tipo: 'noticia' as const,
              id: n.id,
              titulo: n.title,
              resumo: n.summary,
              data: n.date.split('T')[0],
              rota: `/noticias/${n.id}`,
            })),
          ...eventos
            .filter(e => e.published && e.featured)
            .map(e => ({
              tipo: 'evento' as const,
              id: e.id,
              titulo: e.title,
              resumo: e.description,
              data: e.date.split('T')[0],
              rota: '/eventos',
              extra: e.location,
            })),
        ];
        return itens.sort((a, b) => b.data.localeCompare(a.data));
      })
    );
  }

  // ── Horários ────────────────────────────────────────────────────────────────

  getMissas(): Observable<Missa[]> {
    return this.http.get<ApiMassa[]>(`${environment.apiUrl}/mass-schedules`).pipe(
      map(items => items.map(m => ({
        dia: m.day,
        horarios: m.times ? m.times.split(',').filter(Boolean) : []
      })))
    );
  }

  getConfissoes(): Observable<Confissao[]> {
    return of(CONFISSOES);
  }

  getObservacoesMissa(): Observable<ObservacaoMissa[]> {
    return this.http.get<ApiHorariosInfo[]>(`${environment.apiUrl}/horarios-info`).pipe(
      map(items => items.map(r => ({ id: r.id, titulo: r.title, descricao: r.description })))
    );
  }

  getSacramentos(): Observable<Sacramento[]> {
    return this.http.get<ApiSacramento[]>(`${environment.apiUrl}/sacramentos`).pipe(
      map(items => items.map(r => ({ id: r.id, titulo: r.title, descricao: r.description, icone: r.icon })))
    );
  }

  // ── Eventos ─────────────────────────────────────────────────────────────────

  getEventos(categoria?: CategoriaEvento): Observable<Evento[]> {
    return this.http.get<ApiEvento[]>(`${environment.apiUrl}/events`).pipe(
      map(items => {
        let lista = items
          .filter(e => e.published)
          .map(e => {
            const { diaSemana, dia, mes, ano } = parseDateParts(e.date);
            return {
              id: e.id,
              titulo: e.title,
              local: e.location,
              data: e.date.split('T')[0],
              diaSemana,
              dia,
              mes,
              ano,
              hora: e.time,
              categoria: e.category as CategoriaEvento,
              descricao: e.description
            };
          })
          .sort((a, b) => a.data.localeCompare(b.data));

        if (categoria) lista = lista.filter(e => e.categoria === categoria);
        return lista;
      })
    );
  }

  getMeses(): Observable<string[]> {
    return this.getEventos().pipe(
      map(eventos => [...new Set(eventos.map(e => `${e.mes}/${e.ano}`))])
    );
  }

  // ── Contato ─────────────────────────────────────────────────────────────────

  getContatoInfo(): Observable<ContatoInfo> {
    return of(CONTATO_INFO);
  }

  enviarMensagem(dados: {
    nome: string; email: string; telefone?: string; assunto: string; mensagem: string;
  }): Observable<{ sucesso: boolean; mensagem: string }> {
    console.log('[contato] Mensagem recebida:', dados);
    return of({ sucesso: true, mensagem: 'Mensagem enviada com sucesso! Retornaremos em breve.' });
  }
}
