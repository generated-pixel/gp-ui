import { Injectable, signal } from '@angular/core';
import { GpTranslation, GP_DEFAULT_TRANSLATION } from './gp-translation.interface';

@Injectable({
  providedIn: 'root'
})
export class GpConfig {
  public ripple = signal<boolean>(true);
  public zIndex = signal<{
    modal: number;
    overlay: number;
    menu: number;
    tooltip: number;
    toast: number;
  }>({
    modal: 1100,
    overlay: 1000,
    menu: 1000,
    tooltip: 1100,
    toast: 1200
  });

  public filterMatchModeOptions = {
    text: ['startsWith', 'contains', 'notContains', 'endsWith', 'equals', 'notEquals'],
    numeric: ['equals', 'notEquals', 'lt', 'lte', 'gt', 'gte'],
    date: ['dateIs', 'dateIsNot', 'dateBefore', 'dateAfter']
  };
}

@Injectable({
  providedIn: 'root'
})
export class GpTranslationService {
  private currentTranslation = signal<GpTranslation>(GP_DEFAULT_TRANSLATION);

  public readonly translation = this.currentTranslation.asReadonly();

  public setTranslation(translation: Partial<GpTranslation>): void {
    this.currentTranslation.update((prev) => ({ ...prev, ...translation }));
  }

  public get<K extends keyof GpTranslation>(key: K): GpTranslation[K] {
    return this.currentTranslation()[key] ?? GP_DEFAULT_TRANSLATION[key];
  }
}

export type GpDirection = 'ltr' | 'rtl';

@Injectable({
  providedIn: 'root'
})
export class GpDirectionService {
  private currentDir = signal<GpDirection>('ltr');

  public readonly dir = this.currentDir.asReadonly();

  public setDirection(direction: GpDirection): void {
    this.currentDir.set(direction);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', direction);
    }
  }

  public isRtl(): boolean {
    return this.currentDir() === 'rtl';
  }

  public toggle(): GpDirection {
    const next = this.isRtl() ? 'ltr' : 'rtl';
    this.setDirection(next);
    return next;
  }
}
