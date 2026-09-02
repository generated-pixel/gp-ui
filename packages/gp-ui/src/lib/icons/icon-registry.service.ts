import { Injectable } from '@angular/core';
import { GP_DEFAULT_ICONS } from './icons.data';

@Injectable({
  providedIn: 'root'
})
export class GpIconRegistry {
  private icons = new Map<string, string>();

  constructor() {
    Object.entries(GP_DEFAULT_ICONS).forEach(([name, svg]) => {
      this.register(name, svg);
    });
  }

  public register(name: string, svgContent: string): void {
    this.icons.set(name, svgContent);
  }

  public registerMany(icons: Record<string, string>): void {
    Object.entries(icons).forEach(([name, svg]) => this.register(name, svg));
  }

  public get(name: string): string | undefined {
    return this.icons.get(name);
  }

  public has(name: string): boolean {
    return this.icons.has(name);
  }

  public registerIcon(name: string, svgContent: string): void {
    this.register(name, svgContent);
  }

  public registerIcons(icons: Record<string, string>): void {
    this.registerMany(icons);
  }

  public getIcon(name: string): string | undefined {
    return this.get(name);
  }

  public hasIcon(name: string): boolean {
    return this.has(name);
  }
}
