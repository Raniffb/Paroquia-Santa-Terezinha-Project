import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment';
import { RealtimeService } from '../../../core/services/realtime.service';

interface Mensagem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const BASE = `${environment.apiUrl}/contact-messages`;

@Component({
  selector: 'app-contato-mensagens',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contato-mensagens.component.html',
  styleUrl: './contato-mensagens.component.scss'
})
export class ContatoMensagensComponent implements OnInit {
  private http     = inject(HttpClient);
  private realtime = inject(RealtimeService);

  mensagens = signal<Mensagem[]>([]);
  expandida  = signal<number | null>(null);
  carregando = signal(true);

  constructor() {
    this.realtime.on('contact-messages:changed')
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.carregar());
  }

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    this.http.get<Mensagem[]>(BASE).subscribe({
      next: data => { this.mensagens.set(data); this.carregando.set(false); },
      error: ()   => this.carregando.set(false)
    });
  }

  get naoLidas(): number {
    return this.mensagens().filter(m => !m.read).length;
  }

  expandir(msg: Mensagem): void {
    const mesmo = this.expandida() === msg.id;
    this.expandida.set(mesmo ? null : msg.id);
    if (!mesmo && !msg.read) this.marcarLida(msg);
  }

  marcarLida(msg: Mensagem): void {
    this.http.patch(`${BASE}/${msg.id}/read`, {}).subscribe({
      next: () => this.mensagens.update(l => l.map(m => m.id === msg.id ? { ...m, read: true } : m))
    });
  }

  excluir(id: number, event: Event): void {
    event.stopPropagation();
    if (!confirm('Excluir esta mensagem?')) return;
    this.http.delete(`${BASE}/${id}`).subscribe({
      next: () => {
        this.mensagens.update(l => l.filter(m => m.id !== id));
        if (this.expandida() === id) this.expandida.set(null);
      }
    });
  }

  formatarData(iso: string): string {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
