import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../../../features/home/components/header/header.component';
import { FooterComponent } from '../../../features/home/components/footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <a href="#main-content" class="pst-skip-link">Pular para o conteúdo principal</a>
    <app-header></app-header>
    <div *ngIf="carregandoRota()" class="pst-route-loading" aria-hidden="true">
      <div class="pst-route-loading__bar"></div>
    </div>
    <main id="main-content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .pst-route-loading {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
      height: 3px;
    }
    .pst-route-loading__bar {
      height: 100%;
      background: var(--color-accent, #c08a2d);
      animation: pst-loading-bar 1.2s ease-in-out infinite;
    }
    @keyframes pst-loading-bar {
      0%   { width: 0%; margin-left: 0; }
      50%  { width: 70%; margin-left: 15%; }
      100% { width: 0%; margin-left: 100%; }
    }
  `]
})
export class LayoutComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private sub!: Subscription;

  carregandoRota = signal(false);

  ngOnInit(): void {
    this.sub = this.router.events.subscribe(e => {
      if (e instanceof NavigationStart)  this.carregandoRota.set(true);
      if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError)
        this.carregandoRota.set(false);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
