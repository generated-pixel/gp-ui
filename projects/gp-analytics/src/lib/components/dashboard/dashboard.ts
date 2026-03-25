import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { gpAnalyticsThemeCssVariables } from '../../config/gp-analytics-config';
import { DashboardWidget } from '../../interfaces/dashboard-layout';
import { GpIcon } from '../../components/icon/icon';
import { DashboardLayoutService } from '../../services/dashboard-layout.service';
import { GP_ANALYTICS_CONFIG, GP_ANALYTICS_TRANSLATIONS } from '../../tokens/gp-analytics.token';
import { Widget } from '../widget/widget';

interface ActiveDashboardInteraction {
  kind: 'move' | 'resize';
  widgetId: string;
  startClientX: number;
  startClientY: number;
  initialWidgets: DashboardWidget[];
}

@Component({
  selector: 'gp-dashboard',
  imports: [NgStyle, Widget, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {
  readonly title = input<string | undefined>(undefined);
  readonly widgets = input<DashboardWidget[]>([]);
  readonly columns = input(12);
  readonly cellWidth = input(64);
  readonly cellHeight = input(64);
  readonly gridGap = input(8);
  readonly locked = input(false);

  readonly widgetsChange = output<DashboardWidget[]>();

  private readonly config = inject(GP_ANALYTICS_CONFIG, { optional: true });
  private readonly layoutService = inject(DashboardLayoutService);
  protected readonly t = inject(GP_ANALYTICS_TRANSLATIONS);
  private readonly managedWidgetsState = signal<DashboardWidget[]>([]);
  private readonly activeInteraction = signal<ActiveDashboardInteraction | undefined>(undefined);

  protected readonly themeStyle = computed(() => gpAnalyticsThemeCssVariables(this.config?.theme));
  protected readonly resolvedTitle = computed(() => this.title() ?? this.t.dashboardDefaultTitle);
  protected readonly hasManagedWidgets = computed(() => this.widgets().length > 0);
  protected readonly managedWidgets = this.managedWidgetsState.asReadonly();
  protected readonly keyboardHelpId = 'gp-dashboard-keyboard-help';
  protected readonly keyboardHelpVisible = signal(false);
  protected readonly keyboardHelpToggleLabel = computed(() =>
    this.keyboardHelpVisible()
      ? this.t.dashboardKeyboardHelpHideLabel
      : this.t.dashboardKeyboardHelpShowLabel,
  );
  protected readonly gridWidthPx = computed(
    () => this.columns() * this.cellWidth() + (this.columns() - 1) * this.gridGap(),
  );
  protected readonly gridHeightPx = computed(() => {
    const rows = this.maxRows();
    return rows * this.cellHeight() + Math.max(0, rows - 1) * this.gridGap();
  });

  constructor() {
    effect(() => {
      const normalized = this.layoutService.normalizeLayout(this.widgets(), this.columns());
      this.managedWidgetsState.set(normalized);
    });
  }

  @HostListener('document:pointermove', ['$event'])
  protected onPointerMove(event: PointerEvent): void {
    const interaction = this.activeInteraction();
    if (!interaction || this.locked()) {
      return;
    }

    const deltaX = event.clientX - interaction.startClientX;
    const deltaY = event.clientY - interaction.startClientY;
    const gridStepX = this.cellWidth() + this.gridGap();
    const gridStepY = this.cellHeight() + this.gridGap();
    const deltaCols = Math.round(deltaX / gridStepX);
    const deltaRows = Math.round(deltaY / gridStepY);
    const source = interaction.initialWidgets.find((x) => x.id === interaction.widgetId);
    if (!source) {
      return;
    }

    let next: DashboardWidget[];
    if (interaction.kind === 'move') {
      next = this.layoutService.moveWidget(
        interaction.initialWidgets,
        interaction.widgetId,
        source.layout.x + deltaCols,
        source.layout.y + deltaRows,
        this.columns(),
      );
    } else {
      next = this.layoutService.resizeWidget(
        interaction.initialWidgets,
        interaction.widgetId,
        source.layout.w + deltaCols,
        source.layout.h + deltaRows,
        this.columns(),
      );
    }

    this.managedWidgetsState.set(next);
  }

  @HostListener('document:pointerup')
  protected onPointerUp(): void {
    if (!this.activeInteraction()) {
      return;
    }

    this.activeInteraction.set(undefined);
    this.widgetsChange.emit(this.managedWidgetsState());
  }

  protected startMove(event: PointerEvent, widget: DashboardWidget): void {
    if (this.isWidgetLocked(widget) || this.isWidgetFixed(widget)) {
      return;
    }

    event.preventDefault();
    this.activeInteraction.set({
      kind: 'move',
      widgetId: widget.id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      initialWidgets: this.managedWidgetsState().map((x) => ({ ...x, layout: { ...x.layout } })),
    });
  }

  protected startResize(event: PointerEvent, widget: DashboardWidget): void {
    if (this.isWidgetLocked(widget)) {
      return;
    }

    event.preventDefault();
    this.activeInteraction.set({
      kind: 'resize',
      widgetId: widget.id,
      startClientX: event.clientX,
      startClientY: event.clientY,
      initialWidgets: this.managedWidgetsState().map((x) => ({ ...x, layout: { ...x.layout } })),
    });
  }

  protected onMoveKeydown(event: KeyboardEvent, widget: DashboardWidget): void {
    if (this.isWidgetLocked(widget) || this.isWidgetFixed(widget) || this.locked()) {
      return;
    }

    const delta = this.arrowDelta(event.key);
    if (!delta) {
      return;
    }

    event.preventDefault();
    const next = this.layoutService.moveWidget(
      this.managedWidgetsState(),
      widget.id,
      widget.layout.x + delta.dx,
      widget.layout.y + delta.dy,
      this.columns(),
    );
    this.managedWidgetsState.set(next);
    this.widgetsChange.emit(next);
  }

  protected onResizeKeydown(event: KeyboardEvent, widget: DashboardWidget): void {
    if (this.isWidgetLocked(widget) || this.locked()) {
      return;
    }

    const delta = this.arrowDelta(event.key);
    if (!delta) {
      return;
    }

    event.preventDefault();
    const next = this.layoutService.resizeWidget(
      this.managedWidgetsState(),
      widget.id,
      widget.layout.w + delta.dx,
      widget.layout.h + delta.dy,
      this.columns(),
    );
    this.managedWidgetsState.set(next);
    this.widgetsChange.emit(next);
  }

  protected isWidgetLocked(widget: DashboardWidget): boolean {
    return this.locked() || widget.locked === true || widget.layout.locked === true;
  }

  protected isWidgetFixed(widget: DashboardWidget): boolean {
    return widget.fixed === true || widget.layout.fixed === true;
  }

  protected toggleKeyboardHelp(): void {
    this.keyboardHelpVisible.update((visible) => !visible);
  }

  protected tileLeftPx(widget: DashboardWidget): number {
    return widget.layout.x * (this.cellWidth() + this.gridGap());
  }

  protected tileTopPx(widget: DashboardWidget): number {
    return widget.layout.y * (this.cellHeight() + this.gridGap());
  }

  protected tileWidthPx(widget: DashboardWidget): number {
    return widget.layout.w * this.cellWidth() + (widget.layout.w - 1) * this.gridGap();
  }

  protected tileHeightPx(widget: DashboardWidget): number {
    return widget.layout.h * this.cellHeight() + (widget.layout.h - 1) * this.gridGap();
  }

  private maxRows(): number {
    const widgets = this.managedWidgetsState();
    if (widgets.length === 0) {
      return 4;
    }

    return Math.max(1, ...widgets.map((widget) => widget.layout.y + widget.layout.h));
  }

  private arrowDelta(key: string): { dx: number; dy: number } | undefined {
    if (key === 'ArrowLeft') {
      return { dx: -1, dy: 0 };
    }
    if (key === 'ArrowRight') {
      return { dx: 1, dy: 0 };
    }
    if (key === 'ArrowUp') {
      return { dx: 0, dy: -1 };
    }
    if (key === 'ArrowDown') {
      return { dx: 0, dy: 1 };
    }

    return undefined;
  }
}
