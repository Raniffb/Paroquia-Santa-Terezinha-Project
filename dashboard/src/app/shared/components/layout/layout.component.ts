import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../features/home/components/header/header.component';
import { FooterComponent } from '../../../features/home/components/footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <a href="#main-content" class="pst-skip-link">Pular para o conteúdo principal</a>
    <app-header></app-header>
    <main id="main-content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `
})
export class LayoutComponent {}
