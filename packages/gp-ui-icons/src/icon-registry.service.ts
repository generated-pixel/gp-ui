import { Injectable } from '@angular/core';
import { GP_DEFAULT_ICONS } from './icons.data';

@Injectable({
  providedIn: 'root'
})
export class GpIconRegistry {
  private icons = new Map<string, string>();

  constructor() {
    this.registerIcons(GP_DEFAULT_ICONS);
  }

  public registerIcon(name: string, svgContent: string): void {
    this.icons.set(name, svgContent);
  }

  public registerIcons(icons: Record<string, string>): void {
    Object.entries(icons).forEach(([name, content]) => {
      this.icons.set(name, content);
    });
  }

  public getIcon(name: string): string | undefined {
    return this.icons.get(name);
  }

  public hasIcon(name: string): boolean {
    return this.icons.has(name);
  }

  public register(name: string, svgContent: string): void {
    this.registerIcon(name, svgContent);
  }

  public registerMany(icons: Record<string, string>): void {
    this.registerIcons(icons);
  }

  public get(name: string): string | undefined {
    return this.getIcon(name);
  }

  public has(name: string): boolean {
    return this.hasIcon(name);
  }
}
