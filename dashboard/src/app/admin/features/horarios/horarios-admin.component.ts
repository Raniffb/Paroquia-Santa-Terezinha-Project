import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminHorariosService } from '../../core/services/admin-horarios.service';
import { AdminConfissao, AdminMissa, AdminObservacao } from '../../core/models/admin.models';

@Component({
  selector: 'app-horarios-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './horarios-admin.component.html',
  styleUrl: './horarios-admin.component.scss'
})
export class HorariosAdminComponent {
  private svc = inject(AdminHorariosService);

  missas      = this.svc.missas;
  confissoes  = this.svc.confissoes;
  observacoes = this.svc.observacoes;

  // ── Edit state ──────────────────────────────────────────────────────────────
  editMissaId      = signal<number | null>(null);
  editConfissaoId  = signal<number | null>(null);
  editObservacaoId = signal<number | null>(null);

  // Temp edit buffers
  editMissaHorarios: string[] = [];
  editConfissao: Partial<AdminConfissao> = {};
  editObservacao: Partial<AdminObservacao> = {};

  // New item buffers
  novaConfissao: Partial<AdminConfissao> = { dia: '', horario: '' };
  novaObservacao: Partial<AdminObservacao> = { titulo: '', descricao: '' };
  mostrarFormConfissao   = signal(false);
  mostrarFormObservacao  = signal(false);

  salvo = signal<string | null>(null);

  private flashSalvo(msg: string): void {
    this.salvo.set(msg);
    setTimeout(() => this.salvo.set(null), 2500);
  }

  // ── Missas ──────────────────────────────────────────────────────────────────
  iniciarEditMissa(missa: AdminMissa): void {
    this.editMissaId.set(missa.id);
    this.editMissaHorarios = [...missa.horarios];
  }

  cancelarEditMissa(): void { this.editMissaId.set(null); }

  salvarMissa(id: number): void {
    const horarios = this.editMissaHorarios.map(h => h.trim()).filter(h => h.length > 0);
    this.svc.updateMissa(id, horarios);
    this.editMissaId.set(null);
    this.flashSalvo('Horários de missa salvos!');
  }

  adicionarHorarioMissa(): void  { this.editMissaHorarios.push(''); }
  removerHorarioMissa(i: number): void { this.editMissaHorarios.splice(i, 1); }
  trackByIndex(i: number): number { return i; }

  // ── Confissões ──────────────────────────────────────────────────────────────
  iniciarEditConfissao(c: AdminConfissao): void {
    this.editConfissaoId.set(c.id);
    this.editConfissao = { ...c };
  }

  cancelarEditConfissao(): void { this.editConfissaoId.set(null); }

  salvarConfissao(id: number): void {
    if (!this.editConfissao.dia?.trim() || !this.editConfissao.horario?.trim()) return;
    this.svc.updateConfissao(id, this.editConfissao.horario!);
    this.editConfissaoId.set(null);
    this.flashSalvo('Horário de confissão salvo!');
  }

  adicionarConfissao(): void {
    if (!this.novaConfissao.dia?.trim() || !this.novaConfissao.horario?.trim()) return;
    this.svc.createConfissao(this.novaConfissao.dia!, this.novaConfissao.horario!);
    this.novaConfissao = { dia: '', horario: '' };
    this.mostrarFormConfissao.set(false);
    this.flashSalvo('Confissão adicionada!');
  }

  excluirConfissao(id: number): void {
    this.svc.deleteConfissao(id);
    this.flashSalvo('Confissão removida.');
  }

  // ── Observações ─────────────────────────────────────────────────────────────
  iniciarEditObservacao(o: AdminObservacao): void {
    this.editObservacaoId.set(o.id);
    this.editObservacao = { ...o };
  }

  cancelarEditObservacao(): void { this.editObservacaoId.set(null); }

  salvarObservacao(id: number): void {
    if (!this.editObservacao.titulo?.trim() || !this.editObservacao.descricao?.trim()) return;
    this.svc.updateObservacao(id, this.editObservacao.titulo!, this.editObservacao.descricao!);
    this.editObservacaoId.set(null);
    this.flashSalvo('Observação salva!');
  }

  adicionarObservacao(): void {
    if (!this.novaObservacao.titulo?.trim() || !this.novaObservacao.descricao?.trim()) return;
    this.svc.createObservacao(this.novaObservacao.titulo!, this.novaObservacao.descricao!);
    this.novaObservacao = { titulo: '', descricao: '' };
    this.mostrarFormObservacao.set(false);
    this.flashSalvo('Observação adicionada!');
  }

  excluirObservacao(id: number): void {
    this.svc.deleteObservacao(id);
    this.flashSalvo('Observação removida.');
  }

  toggleFormConfissao(): void  { this.mostrarFormConfissao.update(v => !v); }
  toggleFormObservacao(): void { this.mostrarFormObservacao.update(v => !v); }
}
