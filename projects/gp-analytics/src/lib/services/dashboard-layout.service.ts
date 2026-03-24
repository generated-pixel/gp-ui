import { Injectable } from '@angular/core';

import { DashboardWidget } from '../interfaces/dashboard-layout';

@Injectable({
  providedIn: 'root',
})
export class DashboardLayoutService {
  normalizeLayout(widgets: DashboardWidget[], columns: number): DashboardWidget[] {
    const next = widgets.map((widget) => this.normalizeWidget(widget, columns));
    return this.resolveLayout(next, undefined, columns);
  }

  moveWidget(
    widgets: DashboardWidget[],
    id: string,
    nextX: number,
    nextY: number,
    columns: number,
  ): DashboardWidget[] {
    const normalized = widgets.map((widget) => this.normalizeWidget(widget, columns));
    const target = normalized.find((x) => x.id === id);
    if (!target || this.isLocked(target)) {
      return normalized;
    }

    const layout = target.layout;
    layout.x = this.clamp(nextX, 0, Math.max(0, columns - layout.w));
    layout.y = Math.max(0, Math.floor(nextY));

    return this.resolveLayout(normalized, id, columns);
  }

  resizeWidget(
    widgets: DashboardWidget[],
    id: string,
    nextW: number,
    nextH: number,
    columns: number,
  ): DashboardWidget[] {
    const normalized = widgets.map((widget) => this.normalizeWidget(widget, columns));
    const target = normalized.find((x) => x.id === id);
    if (!target || this.isLocked(target)) {
      return normalized;
    }

    const layout = target.layout;
    const minW = layout.minW ?? 1;
    const minH = layout.minH ?? 1;
    const maxW = layout.maxW ?? columns;
    const maxH = layout.maxH ?? Number.MAX_SAFE_INTEGER;

    layout.w = this.clamp(Math.floor(nextW), minW, Math.min(maxW, columns));
    layout.h = this.clamp(Math.floor(nextH), minH, maxH);

    if (layout.x + layout.w > columns) {
      layout.x = Math.max(0, columns - layout.w);
    }

    return this.resolveLayout(normalized, id, columns);
  }

  private resolveLayout(
    widgets: DashboardWidget[],
    anchorId: string | undefined,
    columns: number,
  ): DashboardWidget[] {
    const map = new Map(widgets.map((x) => [x.id, this.cloneWidget(x)]));
    const locked = widgets
      .filter((x) => this.isLocked(x) && x.id !== anchorId)
      .map((x) => map.get(x.id)!)
      .sort((a, b) => a.layout.y - b.layout.y || a.layout.x - b.layout.x);

    const anchor = anchorId ? map.get(anchorId) : undefined;
    if (anchor && !this.isLocked(anchor)) {
      this.pushDownUntilFree(anchor, locked, columns);
    }

    const placed: DashboardWidget[] = [];
    if (anchor) {
      placed.push(anchor);
    }
    placed.push(...locked);

    const floating = widgets
      .filter((x) => x.id !== anchorId && !(this.isLocked(x) && x.id !== anchorId))
      .map((x) => map.get(x.id)!)
      .sort((a, b) => a.layout.y - b.layout.y || a.layout.x - b.layout.x);

    floating.forEach((widget) => {
      this.pushDownUntilFree(widget, placed, columns);
      placed.push(widget);
    });

    return widgets.map((widget) => {
      const resolved = placed.find((x) => x.id === widget.id) ?? map.get(widget.id)!;
      return this.cloneWidget(resolved);
    });
  }

  private pushDownUntilFree(
    widget: DashboardWidget,
    placed: DashboardWidget[],
    columns: number,
  ): void {
    widget.layout.x = this.clamp(widget.layout.x, 0, Math.max(0, columns - widget.layout.w));
    widget.layout.y = Math.max(0, widget.layout.y);

    while (placed.some((x) => this.overlaps(widget, x))) {
      widget.layout.y += 1;
    }
  }

  private overlaps(a: DashboardWidget, b: DashboardWidget): boolean {
    const ax2 = a.layout.x + a.layout.w;
    const ay2 = a.layout.y + a.layout.h;
    const bx2 = b.layout.x + b.layout.w;
    const by2 = b.layout.y + b.layout.h;

    return a.layout.x < bx2 && ax2 > b.layout.x && a.layout.y < by2 && ay2 > b.layout.y;
  }

  private normalizeWidget(widget: DashboardWidget, columns: number): DashboardWidget {
    const clone = this.cloneWidget(widget);
    const layout = clone.layout;

    layout.w = this.clamp(
      Math.floor(layout.w || 1),
      layout.minW ?? 1,
      Math.min(layout.maxW ?? columns, columns),
    );
    layout.h = this.clamp(
      Math.floor(layout.h || 1),
      layout.minH ?? 1,
      layout.maxH ?? Number.MAX_SAFE_INTEGER,
    );
    layout.x = this.clamp(Math.floor(layout.x || 0), 0, Math.max(0, columns - layout.w));
    layout.y = Math.max(0, Math.floor(layout.y || 0));

    return clone;
  }

  private isLocked(widget: DashboardWidget): boolean {
    return widget.locked === true || widget.layout.locked === true;
  }

  private cloneWidget(widget: DashboardWidget): DashboardWidget {
    return {
      ...widget,
      layout: { ...widget.layout },
    };
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}
