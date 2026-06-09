import { Component, signal, inject, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavItem { label: string; route: string; icon: string; }

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);

  drawerAberto = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard',  route: '/admin',          icon: 'pi pi-home' },
    { label: 'Notícias',   route: '/admin/noticias', icon: 'pi pi-file' },
    { label: 'Avisos',     route: '/admin/avisos',   icon: 'pi pi-bell' },
    { label: 'Eventos',    route: '/admin/eventos',  icon: 'pi pi-calendar' },
    { label: 'Horários',   route: '/admin/horarios', icon: 'pi pi-clock' }
  ];

  get nomeUsuario(): string { return this.auth.nomeUsuario(); }

  toggleDrawer(): void { this.drawerAberto.update(v => !v); }
  fecharDrawer(): void  { this.drawerAberto.set(false); }

  sair(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('document:keydown.escape')
  onEsc(): void { this.fecharDrawer(); }
}
