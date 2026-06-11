import { Component, ElementRef, inject, NgZone, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { EditorModule } from 'primeng/editor';
import Quill from 'quill';
import { AdminNoticiasService } from '../../core/services/admin-noticias.service';
import { AdminCatNoticia } from '../../core/models/admin.models';

// Extend Quill image format to persist inline style attribute (enables width resize)
const _ImageBase = Quill.import('formats/image') as any;
if (!_ImageBase._styledRegistered) {
  class StyledImage extends _ImageBase {
    static formats(node: HTMLElement): Record<string, string> {
      const base: Record<string, string> = super.formats?.(node) ?? {};
      const style = node.getAttribute('style');
      if (style) base['style'] = style;
      return base;
    }
    format(name: string, value: string): void {
      if (name === 'style') {
        value ? this['domNode'].setAttribute('style', value)
               : this['domNode'].removeAttribute('style');
      } else {
        super.format(name, value);
      }
    }
  }
  StyledImage['blotName'] = 'image';
  StyledImage['tagName']  = 'IMG';
  Quill.register({ 'formats/image': StyledImage }, true);
  _ImageBase._styledRegistered = true;
}

@Component({
  selector: 'app-noticias-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, EditorModule],
  templateUrl: './noticias-form.component.html',
  styleUrl: './noticias-form.component.scss'
})
export class NoticiasFormComponent implements OnInit, OnDestroy {
  private fb     = inject(FormBuilder);
  private svc    = inject(AdminNoticiasService);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  private zone   = inject(NgZone);

  @ViewChild('editorWrapper', { static: false }) editorWrapperRef!: ElementRef<HTMLElement>;

  quillEditor: any = null;
  private editorHtml: string | null = null;
  private resizeImg: HTMLImageElement | null = null;
  private resizeOverlayEl: HTMLDivElement | null = null;
  private resizeHandle = '';
  private resizeStartX = 0;
  private resizeStartWidth = 0;
  private boundMouseMove: ((e: MouseEvent) => void) | null = null;
  private boundMouseUp: ((e: MouseEvent) => void) | null = null;
  private boundDocClick: ((e: MouseEvent) => void) | null = null;

  editorModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  };

  hoje = new Date().toISOString().split('T')[0];

  editId     = signal<number | null>(null);
  salvo      = signal(false);
  carregando = signal(false);
  erro       = signal<string | null>(null);

  categorias: { value: AdminCatNoticia; label: string }[] = [
    { value: 'paroquia', label: 'Paróquia' },
    { value: 'diocese',  label: 'Diocese' },
    { value: 'social',   label: 'Social' },
    { value: 'liturgia', label: 'Liturgia' },
    { value: 'formacao', label: 'Formação' }
  ];

  form = this.fb.group({
    titulo:    ['', [Validators.required, Validators.maxLength(120)]],
    data:      ['', [Validators.required]],
    categoria: ['paroquia' as AdminCatNoticia, [Validators.required]],
    autor:     ['', [Validators.required, Validators.maxLength(60)]],
    resumo:    ['', [Validators.required, Validators.maxLength(300)]],
    corpo:     ['', [Validators.required]],
    destaque:  [false],
    publicado: [false]
  });

  get modoEdicao(): boolean { return this.editId() !== null; }

  onEditorInit(event: { editor: any }): void {
    this.quillEditor = event.editor;
    this.buildResizeOverlay();

    const initialHtml = this.quillEditor.root.innerHTML;
    this.editorHtml = initialHtml === '<p><br></p>' ? '' : initialHtml;

    this.quillEditor.on('text-change', (_d: any, _od: any, source: string) => {
      if (source === 'user') {
        const html = this.quillEditor?.root?.innerHTML ?? '';
        this.editorHtml = html === '<p><br></p>' ? '' : html;
      }
    });

    this.quillEditor.root.addEventListener('click', (e: MouseEvent) => {
      this.zone.run(() => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'IMG') {
          this.resizeImg = target as HTMLImageElement;
          this.updateOverlayPosition();
        }
      });
    });

    this.quillEditor.root.addEventListener('scroll', () => {
      if (this.resizeImg) this.updateOverlayPosition();
    });

    this.boundDocClick = (e: MouseEvent) => {
      this.zone.run(() => {
        const target = e.target as Node;
        if (!this.editorWrapperRef?.nativeElement.contains(target)) {
          this.hideOverlay();
        }
      });
    };
    document.addEventListener('click', this.boundDocClick, true);
  }

  private buildResizeOverlay(): void {
    const container = this.editorWrapperRef.nativeElement;
    this.resizeOverlayEl = document.createElement('div');
    this.resizeOverlayEl.className = 'adm-img-resize-overlay';

    ['nw', 'ne', 'se', 'sw', 'e', 'w'].forEach(pos => {
      const handle = document.createElement('div');
      handle.className = `adm-img-resize-handle adm-img-resize-handle--${pos}`;
      handle.addEventListener('mousedown', (e: MouseEvent) => {
        this.zone.run(() => this.onHandleMouseDown(e, pos));
      });
      this.resizeOverlayEl!.appendChild(handle);
    });

    container.appendChild(this.resizeOverlayEl);
  }

  private updateOverlayPosition(): void {
    if (!this.resizeImg || !this.resizeOverlayEl || !this.editorWrapperRef) return;
    const cr = this.editorWrapperRef.nativeElement.getBoundingClientRect();
    const ir = this.resizeImg.getBoundingClientRect();
    Object.assign(this.resizeOverlayEl.style, {
      display: 'block',
      top:    `${ir.top  - cr.top  - 1}px`,
      left:   `${ir.left - cr.left - 1}px`,
      width:  `${ir.width  + 2}px`,
      height: `${ir.height + 2}px`,
    });
  }

  private hideOverlay(): void {
    this.resizeImg = null;
    if (this.resizeOverlayEl) this.resizeOverlayEl.style.display = 'none';
  }

  private onHandleMouseDown(e: MouseEvent, handle: string): void {
    e.preventDefault();
    e.stopPropagation();
    if (!this.resizeImg) return;

    this.resizeHandle     = handle;
    this.resizeStartX     = e.clientX;
    this.resizeStartWidth = this.resizeImg.getBoundingClientRect().width;
    document.body.style.userSelect = 'none';

    this.boundMouseMove = (ev: MouseEvent) => this.zone.run(() => this.onDragMove(ev));
    this.boundMouseUp   = ()               => this.zone.run(() => this.onDragEnd());
    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup',   this.boundMouseUp);
  }

  private onDragMove(e: MouseEvent): void {
    if (!this.resizeHandle || !this.resizeImg) return;
    const dx = e.clientX - this.resizeStartX;
    const newWidth = Math.max(40,
      this.resizeHandle.includes('w')
        ? this.resizeStartWidth - dx
        : this.resizeStartWidth + dx
    );
    this.resizeImg.style.width  = `${newWidth}px`;
    this.resizeImg.style.height = 'auto';
    this.updateOverlayPosition();
  }

  private onDragEnd(): void {
    if (this.boundMouseMove) document.removeEventListener('mousemove', this.boundMouseMove);
    if (this.boundMouseUp)   document.removeEventListener('mouseup',   this.boundMouseUp);
    this.boundMouseMove = null;
    this.boundMouseUp   = null;
    document.body.style.userSelect = '';
    this.resizeHandle = '';

    if (!this.resizeImg || !this.quillEditor) return;

    const width = Math.round(this.resizeImg.getBoundingClientRect().width);
    const style = `width: ${width}px; height: auto;`;
    this.resizeImg.setAttribute('style', style);

    try {
      const blot = (Quill as any).find(this.resizeImg);
      if (blot) {
        const index = this.quillEditor.getIndex(blot);
        this.quillEditor.updateContents(
          { ops: [{ retain: index }, { retain: 1, attributes: { style } }] },
          'api'
        );
      }
    } catch { /* blot not found */ }

    const html = this.quillEditor.root.innerHTML;
    this.editorHtml = html === '<p><br></p>' ? '' : html;

    this.updateOverlayPosition();
  }

  ngOnDestroy(): void {
    if (this.boundDocClick) document.removeEventListener('click', this.boundDocClick, true);
    if (this.boundMouseMove) document.removeEventListener('mousemove', this.boundMouseMove);
    if (this.boundMouseUp)   document.removeEventListener('mouseup',   this.boundMouseUp);
    if (this.resizeOverlayEl) this.resizeOverlayEl.remove();
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.svc.getById(id).subscribe(item => {
      if (item) {
        this.editId.set(id);
        this.form.patchValue({
          titulo: item.titulo, data: item.data, categoria: item.categoria,
          autor: item.autor, resumo: item.resumo, corpo: item.corpo,
          destaque: item.destaque, publicado: item.publicado
        });
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.erro.set(null);
    this.carregando.set(true);
    const v = this.form.value as any;

    if (this.editorHtml !== null) {
      v.corpo = this.editorHtml;
    }

    const op = this.modoEdicao
      ? this.svc.update(this.editId()!, v)
      : this.svc.create(v);

    op.subscribe({
      next: () => {
        this.carregando.set(false);
        this.salvo.set(true);
        setTimeout(() => this.router.navigate(['/admin/noticias']), 800);
      },
      error: () => {
        this.carregando.set(false);
        this.erro.set('Erro ao salvar. Verifique os dados e tente novamente.');
      }
    });
  }

  f(campo: string) { return this.form.get(campo)!; }
  err(campo: string): boolean { return this.f(campo).invalid && this.f(campo).touched; }
}
