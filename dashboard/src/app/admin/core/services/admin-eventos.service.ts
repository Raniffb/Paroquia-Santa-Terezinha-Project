import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { AdminCatEvento, AdminEvento } from '../models/admin.models';
import { environment } from '../../../../environments/environment';

const BASE = `${environment.apiUrl}/events`;

interface ApiEvento {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  summary: string;
  description: string;
  category: string;
  published: boolean;
  featured: boolean;
}

function toAdmin(r: ApiEvento): AdminEvento {
  return {
    id: r.id,
    titulo: r.title,
    data: r.date.split('T')[0],
    hora: r.time,
    local: r.location,
    resumo: r.summary,
    descricao: r.description,
    categoria: r.category as AdminCatEvento,
    publicado: r.published,
    destaque: r.featured ?? false
  };
}

function toApi(v: Omit<AdminEvento, 'id'>): object {
  return {
    title: v.titulo,
    date: v.data,
    time: v.hora,
    location: v.local,
    summary: v.resumo,
    description: v.descricao,
    category: v.categoria,
    published: v.publicado,
    featured: v.destaque
  };
}

@Injectable({ providedIn: 'root' })
export class AdminEventosService {
  private http = inject(HttpClient);

  private _items   = signal<AdminEvento[]>([]);
  private _loading = signal(false);

  readonly items   = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();

  constructor() { this.carregar(); }

  carregar(): void {
    this._loading.set(true);
    this.http.get<ApiEvento[]>(BASE).subscribe({
      next: data => { this._items.set(data.map(toAdmin)); this._loading.set(false); },
      error: ()   => this._loading.set(false)
    });
  }

  getAll(): AdminEvento[] { return this._items(); }

  getById(id: number): Observable<AdminEvento | undefined> {
    const local = this._items().find(e => e.id === id);
    if (local) return of(local);
    return this.http.get<ApiEvento>(`${BASE}/${id}`).pipe(map(toAdmin));
  }

  create(data: Omit<AdminEvento, 'id'>): Observable<AdminEvento> {
    return this.http.post<ApiEvento>(BASE, toApi(data)).pipe(
      map(r => {
        const item = toAdmin(r);
        this._items.update(l => [...l, item].sort((a, b) => a.data.localeCompare(b.data)));
        return item;
      })
    );
  }

  update(id: number, data: Omit<AdminEvento, 'id'>): Observable<AdminEvento> {
    return this.http.patch<ApiEvento>(`${BASE}/${id}`, toApi(data)).pipe(
      map(r => {
        const item = toAdmin(r);
        this._items.update(l =>
          l.map(e => e.id === id ? item : e).sort((a, b) => a.data.localeCompare(b.data))
        );
        return item;
      })
    );
  }

  delete(id: number): void {
    this.http.delete(`${BASE}/${id}`).subscribe(() => {
      this._items.update(l => l.filter(e => e.id !== id));
    });
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
