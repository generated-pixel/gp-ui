import { Injectable, inject } from '@angular/core';
import { GpConfig } from '../config/gp-config.service';

@Injectable({
  providedIn: 'root'
})
export class ZIndexService {
  private config = inject(GpConfig);
  private zIndexes: Record<string, number> = {};

  constructor() {
    this.zIndexes = { ...this.config.zIndex() };
  }

  public get(key: 'modal' | 'overlay' | 'menu' | 'tooltip' | 'toast'): number {
    if (!this.zIndexes[key]) {
      this.zIndexes[key] = this.config.zIndex()[key] || 1000;
    }
    return ++this.zIndexes[key];
  }

  public set(key: 'modal' | 'overlay' | 'menu' | 'tooltip' | 'toast', value: number): void {
    this.zIndexes[key] = value;
  }
}
