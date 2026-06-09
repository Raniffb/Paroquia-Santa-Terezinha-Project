import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'pst-font-level';
const LEVELS = [14, 16, 19, 22, 26];
const DEFAULT_LEVEL = 1; // 16px

@Injectable({ providedIn: 'root' })
export class FontSizeService {
  private level = signal<number>(this.loadLevel());

  currentLevel = this.level.asReadonly();

  get currentPx(): number {
    return LEVELS[this.level()];
  }

  get canDecrease(): boolean {
    return this.level() > 0;
  }

  get canIncrease(): boolean {
    return this.level() < LEVELS.length - 1;
  }

  decrease(): void {
    if (this.canDecrease) {
      this.setLevel(this.level() - 1);
    }
  }

  increase(): void {
    if (this.canIncrease) {
      this.setLevel(this.level() + 1);
    }
  }

  private setLevel(level: number): void {
    this.level.set(level);
    document.documentElement.style.setProperty('font-size', LEVELS[level] + 'px');
    try { localStorage.setItem(STORAGE_KEY, String(level)); } catch { /* ignore */ }
  }

  private loadLevel(): number {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const n = saved !== null ? parseInt(saved, 10) : DEFAULT_LEVEL;
      return isNaN(n) || n < 0 || n >= LEVELS.length ? DEFAULT_LEVEL : n;
    } catch {
      return DEFAULT_LEVEL;
    }
  }

  applyStored(): void {
    document.documentElement.style.setProperty('font-size', this.currentPx + 'px');
  }
}
