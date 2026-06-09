import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontSizeService } from '../../../../core/services/font-size.service';

interface NavItem {
  label: string;
  route: string;
  exact: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  fs = inject(FontSizeService);
  menuOpen = false;

  navItems: NavItem[] = [
    { label: 'Início',    route: '/',         exact: true },
    { label: 'Notícias',  route: '/noticias',  exact: false },
    { label: 'Avisos',    route: '/avisos',    exact: false },
    { label: 'Horários',  route: '/horarios',  exact: false },
    { label: 'Eventos',   route: '/eventos',   exact: false },
    { label: 'Contato',   route: '/contato',   exact: false }
  ];

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
