import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AdminHorariosService } from '../../core/services/admin-horarios.service';
import { AdminConfissao, AdminMissa, AdminObservacao, AdminSacramento } from '../../core/models/admin.models';
import { normalizeSchedule, normalizeTime } from '../../core/utils/time.utils';

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

  mostrarPickerNovo  = signal(false);
  mostrarPickerEdit  = signal(false);

  readonly ICONES_CATEGORIAS = [
    {
      label: 'Liturgia e Fé',
      icones: ['pi-sun', 'pi-star', 'pi-star-fill', 'pi-crown', 'pi-cloud', 'pi-fire', 'pi-sparkles', 'pi-moon']
    },
    {
      label: 'Sacramentos',
      icones: ['pi-drop', 'pi-heart', 'pi-heart-fill', 'pi-bookmark', 'pi-bookmark-fill', 'pi-shield', 'pi-check-circle', 'pi-circle']
    },
    {
      label: 'Comunidade',
      icones: ['pi-user', 'pi-users', 'pi-home', 'pi-building', 'pi-globe', 'pi-map-marker']
    },
    {
      label: 'Geral',
      icones: ['pi-calendar', 'pi-clock', 'pi-bell', 'pi-book', 'pi-info-circle', 'pi-envelope', 'pi-phone', 'pi-gift', 'pi-thumbs-up']
    }
  ];

  togglePickerNovo(): void { this.mostrarPickerNovo.update(v => !v); }
  togglePickerEdit(): void { this.mostrarPickerEdit.update(v => !v); }

  selecionarIconeNovo(icone: string): void {
    this.novoSacramento.icone = icone;
    this.mostrarPickerNovo.set(false);
  }

  selecionarIconeEdit(icone: string): void {
    this.editSacramento.icone = icone;
    this.mostrarPickerEdit.set(false);
  }

  salvo = signal<string | null>(null);
  erroMissa      = signal<string | null>(null);
  erroConfissao  = signal<string | null>(null);

  private flashSalvo(msg: string): void {
    this.salvo.set(msg);
    setTimeout(() => this.salvo.set(null), 2500);
  }

  // ── Missas ──────────────────────────────────────────────────────────────────
  iniciarEditMissa(missa: AdminMissa): void {
    this.editMissaId.set(missa.id);
    this.editMissaHorarios = [...missa.horarios];
  }

  cancelarEditMissa(): void { this.editMissaId.set(null); this.erroMissa.set(null); }

  salvarMissa(id: number): void {
    const raw = this.editMissaHorarios.map(h => h.trim()).filter(h => h.length > 0);
    const horarios: string[] = [];
    for (const h of raw) {
      const n = normalizeTime(h);
      if (!n) {
        this.erroMissa.set(`"${h}" não é válido. Use o formato 18h00 ou 18:00.`);
        return;
      }
      horarios.push(n);
    }
    // Normaliza os valores no array para exibição
    this.editMissaHorarios = horarios;
    this.erroMissa.set(null);
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
    const horarioNorm = normalizeSchedule(this.editConfissao.horario!);
    if (!horarioNorm) {
      this.erroConfissao.set('Horário inválido. Use o formato 18h00 ou 18:00. Ex: 08h00 às 08h45');
      return;
    }
    this.erroConfissao.set(null);
    this.editConfissao.horario = horarioNorm;
    this.svc.updateConfissao(id, this.editConfissao.dia!, horarioNorm).subscribe({
      next: () => {
        this.editConfissaoId.set(null);
        this.flashSalvo('Horário de confissão salvo!');
      }
    });
  }

  adicionarConfissao(): void {
    if (!this.novaConfissao.dia?.trim() || !this.novaConfissao.horario?.trim()) return;
    const horarioNorm = normalizeSchedule(this.novaConfissao.horario!);
    if (!horarioNorm) {
      this.erroConfissao.set('Horário inválido. Use o formato 18h00 ou 18:00. Ex: 08h00 às 08h45');
      return;
    }
    this.erroConfissao.set(null);
    this.novaConfissao.horario = horarioNorm;
    this.svc.createConfissao(this.novaConfissao.dia!, horarioNorm).subscribe({
      next: () => {
        this.novaConfissao = { dia: '', horario: '' };
        this.mostrarFormConfissao.set(false);
        this.flashSalvo('Confissão adicionada!');
      }
    });
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
