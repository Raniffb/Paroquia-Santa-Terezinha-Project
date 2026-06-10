import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { AdminAviso, AdminCatAviso } from '../models/admin.models';
import { environment } from '../../../../environments/environment';

const BASE = `${environment.apiUrl}/notices`;

interface ApiAviso {
  id: number;
  title: string;
  date: string;
  summary: string;
  description: string;
  priority: string;
  category: string;
  active: boolean;
  featured: boolean;
}

function toAdmin(r: ApiAviso): AdminAviso {
  return {
    id: r.id,
    titulo: r.title,
    data: r.date.split('T')[0],
    resumo: r.summary,
    corpo: r.description,
    categoria: r.category as AdminCatAviso,
    urgente: r.priority === 'urgent',
    ativo: r.active,
    destaque: r.featured ?? false
  };
}

function toApi(v: Omit<AdminAviso, 'id'>): object {
  return {
    title: v.titulo,
    date: v.data,
    summary: v.resumo,
    description: v.corpo,
    priority: v.urgente ? 'urgent' : 'normal',
    category: v.categoria,
    active: v.ativo,
    featured: v.destaque
  };
}

@Injectable({ providedIn: 'root' })
export class AdminAvisosService {
  private http = inject(HttpClient);

  private _items   = signal<AdminAviso[]>([]);
  private _loading = signal(false);

  readonly items   = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();

  constructor() { this.carregar(); }

  carregar(): void {
    this._loading.set(true);
    this.http.get<ApiAviso[]>(BASE).subscribe({
      next: data => { this._items.set(data.map(toAdmin)); this._loading.set(false); },
      error: ()   => this._loading.set(false)
    });
  }

  getAll(): AdminAviso[] { return this._items(); }

  getById(id: number): Observable<AdminAviso | undefined> {
    const local = this._items().find(a => a.id === id);
    if (local) return of(local);
    return this.http.get<ApiAviso>(`${BASE}/${id}`).pipe(map(toAdmin));
  }

  create(data: Omit<AdminAviso, 'id'>): Observable<AdminAviso> {
    return this.http.post<ApiAviso>(BASE, toApi(data)).pipe(
      map(r => {
        const item = toAdmin(r);
        this._items.update(l => [item, ...l]);
        return item;
      })
    );
  }

  update(id: number, data: Omit<AdminAviso, 'id'>): Observable<AdminAviso> {
    return this.http.patch<ApiAviso>(`${BASE}/${id}`, toApi(data)).pipe(
      map(r => {
        const item = toAdmin(r);
        this._items.update(l => l.map(a => a.id === id ? item : a));
        return item;
      })
    );
  }

  delete(id: number): void {
    this.http.delete(`${BASE}/${id}`).subscribe(() => {
      this._items.update(l => l.filter(a => a.id !== id));
    });
  }

  labelCategoria(cat: AdminCatAviso): string {
    const map: Record<AdminCatAviso, string> = {
      liturgia: 'Liturgia', comunidade: 'Comunidade', administrativo: 'Administrativo',
      formacao: 'Formação', social: 'Social', geral: 'Geral'
    };
    return map[cat];
  }
}
