import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { AdminCatNoticia, AdminNoticia } from '../models/admin.models';
import { environment } from '../../../../environments/environment';

const BASE = `${environment.apiUrl}/news`;

interface ApiNoticia {
  id: number;
  title: string;
  date: string;
  summary: string;
  content: string;
  imageUrl?: string;
  featured: boolean;
  category: string;
  author: string;
  published: boolean;
}

function toAdmin(r: ApiNoticia): AdminNoticia {
  return {
    id: r.id,
    titulo: r.title,
    data: r.date.split('T')[0],
    resumo: r.summary,
    corpo: r.content,
    categoria: r.category as AdminCatNoticia,
    autor: r.author,
    destaque: r.featured,
    publicado: r.published
  };
}

function toApi(v: Omit<AdminNoticia, 'id'>): object {
  return {
    title: v.titulo,
    date: v.data,
    summary: v.resumo,
    content: v.corpo,
    category: v.categoria,
    author: v.autor,
    featured: v.destaque,
    published: v.publicado
  };
}

@Injectable({ providedIn: 'root' })
export class AdminNoticiasService {
  private http = inject(HttpClient);

  private _items   = signal<AdminNoticia[]>([]);
  private _loading = signal(false);

  readonly items   = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();

  constructor() { this.carregar(); }

  carregar(): void {
    this._loading.set(true);
    this.http.get<ApiNoticia[]>(BASE).subscribe({
      next: data => { this._items.set(data.map(toAdmin)); this._loading.set(false); },
      error: ()   => this._loading.set(false)
    });
  }

  getAll(): AdminNoticia[] { return this._items(); }

  getById(id: number): Observable<AdminNoticia | undefined> {
    const local = this._items().find(n => n.id === id);
    if (local) return of(local);
    return this.http.get<ApiNoticia>(`${BASE}/${id}`).pipe(map(toAdmin));
  }

  create(data: Omit<AdminNoticia, 'id'>): Observable<AdminNoticia> {
    return this.http.post<ApiNoticia>(BASE, toApi(data)).pipe(
      map(r => {
        const item = toAdmin(r);
        this._items.update(l => [item, ...l]);
        return item;
      })
    );
  }

  update(id: number, data: Omit<AdminNoticia, 'id'>): Observable<AdminNoticia> {
    return this.http.patch<ApiNoticia>(`${BASE}/${id}`, toApi(data)).pipe(
      map(r => {
        const item = toAdmin(r);
        this._items.update(l => l.map(n => n.id === id ? item : n));
        return item;
      })
    );
  }

  delete(id: number): void {
    this.http.delete(`${BASE}/${id}`).subscribe(() => {
      this._items.update(l => l.filter(n => n.id !== id));
    });
  }

  labelCategoria(cat: AdminCatNoticia): string {
    const map: Record<AdminCatNoticia, string> = {
      paroquia: 'Paróquia', diocese: 'Diocese',
      social: 'Social', liturgia: 'Liturgia', formacao: 'Formação'
    };
    return map[cat];
  }
}
