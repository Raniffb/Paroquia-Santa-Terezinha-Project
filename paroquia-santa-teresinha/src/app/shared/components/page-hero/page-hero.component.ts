import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-hero.component.html',
  styleUrl: './page-hero.component.scss'
})
export class PageHeroComponent {
  @Input() icon = 'pi-home';
  @Input() titulo = '';
  @Input() subtitulo = '';
}
