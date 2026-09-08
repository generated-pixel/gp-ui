import { Injectable, signal } from '@angular/core';
import { GpWidgetLibraryItem, GpReportLibraryItem } from '../interfaces/widget-library.interface';
import { UniqueId } from '../utils/unique-id';

@Injectable({
  providedIn: 'root'
})
export class GpWidgetLibraryService {
  /**
   * Internal reactive signal of widget templates available in the library.
   * Empty by default in the core library package; populated dynamically or by demo apps.
   */
  readonly widgetLibrary = signal<GpWidgetLibraryItem[]>([]);

  /**
   * Internal reactive signal of report templates available in the library.
   * Empty by default in the core library package; populated dynamically or by demo apps.
   */
  readonly reportLibrary = signal<GpReportLibraryItem[]>([]);

  /**
   * Adds a new widget template to the library.
   */
  addWidget(item: Omit<GpWidgetLibraryItem, 'id' | 'createdAt'>): GpWidgetLibraryItem {
    const fullItem: GpWidgetLibraryItem = {
      ...item,
      id: UniqueId.generate('lib-w-'),
      createdAt: new Date().toISOString()
    };
    this.widgetLibrary.update((items) => [fullItem, ...items]);
    return fullItem;
  }

  /**
   * Removes a widget template by ID.
   */
  removeWidget(id: string): void {
    this.widgetLibrary.update((items) => items.filter((w) => w.id !== id));
  }

  /**
   * Adds a new report template to the library.
   */
  addReport(item: Omit<GpReportLibraryItem, 'id' | 'createdAt'>): GpReportLibraryItem {
    const fullItem: GpReportLibraryItem = {
      ...item,
      id: UniqueId.generate('lib-r-'),
      createdAt: new Date().toISOString()
    };
    this.reportLibrary.update((items) => [fullItem, ...items]);
    return fullItem;
  }

  /**
   * Removes a report template by ID.
   */
  removeReport(id: string): void {
    this.reportLibrary.update((items) => items.filter((r) => r.id !== id));
  }
}
