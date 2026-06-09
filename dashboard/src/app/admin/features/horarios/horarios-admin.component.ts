import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AdminHorariosService } from '../../core/services/admin-horarios.service';
import { AdminConfissao, AdminMissa, AdminObservacao, AdminSacramento } from '../../core/models/admin.models';

@Component({
  selector: 'app-horarios-admin',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './horarios-admin.component.html',
  styleUrl: './horarios-admin.component.scss'
})
export class HorariosAdminComponent {
  private svc = inject(AdminHorariosService);

  missas      = this.svc.missas;
  sacramentos = this.svc.sacramentos;
  confissoes  = this.svc.confissoes;
  observacoes = this.svc.observacoes;

  // ── Edit state ──────────────────────────────────────────────────────────────
  editMissaId        = signal<number | null>(null);
  editSacramentoId   = signal<number | null>(null);
  editConfissaoId    = signal<number | null>(null);
  editObservacaoId   = signal<number | null>(null);

  editMissaHorarios: string[] = [];
  editConfissao:   Partial<AdminConfissao>  = {};
  editObservacao:  Partial<AdminObservacao> = {};
  editSacramento:  Partial<AdminSacramento> = {};

  novaConfissao:  Partial<AdminConfissao>  = { dia: '', horario: '' };
  novaObservacao: Partial<AdminObservacao> = { titulo: '', descricao: '' };
  novoSacramento: Partial<AdminSacramento> = { titulo: '', descricao: '', icone: '' };

  mostrarFormConfissao  = signal(false);
  mostrarFormObservacao = signal(false);
  mostrarFormSacramento = signal(false);

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
    this.svc.updateMissa(id, horarios).subscribe({
      next: () => { this.editMissaId.set(null); this.flashSalvo('Horários de missa salvos!'); },
      error: () => this.flashSalvo('Erro ao salvar horários. Tente novamente.')
    });
  }

  adicionarHorarioMissa(): void  { this.editMissaHorarios.push(''); }
  removerHorarioMissa(i: number): void { this.editMissaHorarios.splice(i, 1); }
  trackByIndex(i: number): number { return i; }

  // ── Sacramentos ─────────────────────────────────────────────────────────────
  iniciarEditSacramento(s: AdminSacramento): void {
    this.editSacramentoId.set(s.id);
    this.editSacramento = { ...s };
  }

  cancelarEditSacramento(): void { this.editSacramentoId.set(null); }

  salvarSacramento(id: number): void {
    if (!this.editSacramento.titulo?.trim() || !this.editSacramento.descricao?.trim()) return;
    this.svc.updateSacramento(
      id,
      this.editSacramento.titulo!,
      this.editSacramento.descricao!,
      this.editSacramento.icone?.trim() || 'pi-star'
    ).subscribe({
      next: () => { this.editSacramentoId.set(null); this.flashSalvo('Sacramento salvo!'); },
      error: () => this.flashSalvo('Erro ao salvar. Tente novamente.')
    });
  }

  adicionarSacramento(): void {
    if (!this.novoSacramento.titulo?.trim() || !this.novoSacramento.descricao?.trim()) return;
    this.svc.createSacramento(
      this.novoSacramento.titulo!,
      this.novoSacramento.descricao!,
      this.novoSacramento.icone?.trim() || 'pi-star'
    ).subscribe({
      next: () => {
        this.novoSacramento = { titulo: '', descricao: '', icone: '' };
        this.mostrarFormSacramento.set(false);
        this.flashSalvo('Sacramento adicionado!');
      },
      error: () => this.flashSalvo('Erro ao adicionar. Tente novamente.')
    });
  }

  excluirSacramento(id: number): void {
    this.svc.deleteSacramento(id);
    this.flashSalvo('Sacramento removido.');
  }

  toggleFormSacramento(): void { this.mostrarFormSacramento.update(v => !v); }

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

  // ── Informações Importantes ──────────────────────────────────────────────────
  iniciarEditObservacao(o: AdminObservacao): void {
    this.editObservacaoId.set(o.id);
    this.editObservacao = { ...o };
  }

  cancelarEditObservacao(): void { this.editObservacaoId.set(null); }

  salvarObservacao(id: number): void {
    if (!this.editObservacao.titulo?.trim() || !this.editObservacao.descricao?.trim()) return;
    this.svc.updateObservacao(id, this.editObservacao.titulo!, this.editObservacao.descricao!).subscribe({
      next: () => { this.editObservacaoId.set(null); this.flashSalvo('Informação salva!'); },
      error: () => this.flashSalvo('Erro ao salvar. Tente novamente.')
    });
  }

  adicionarObservacao(): void {
    if (!this.novaObservacao.titulo?.trim() || !this.novaObservacao.descricao?.trim()) return;
    this.svc.createObservacao(this.novaObservacao.titulo!, this.novaObservacao.descricao!).subscribe({
      next: () => {
        this.novaObservacao = { titulo: '', descricao: '' };
        this.mostrarFormObservacao.set(false);
        this.flashSalvo('Informação adicionada!');
      },
      error: () => this.flashSalvo('Erro ao adicionar. Tente novamente.')
    });
  }

  excluirObservacao(id: number): void {
    this.svc.deleteObservacao(id);
    this.flashSalvo('Informação removida.');
  }

  toggleFormConfissao(): void  { this.mostrarFormConfissao.update(v => !v); }
  toggleFormObservacao(): void { this.mostrarFormObservacao.update(v => !v); }
}
