import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontSizeService } from './core/services/font-size.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class AppComponent implements OnInit {
  private fs = inject(FontSizeService);

  ngOnInit(): void {
    this.fs.applyStored();
  }
}
