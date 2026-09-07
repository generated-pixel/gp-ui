import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  input,
  output,
  computed,
  effect,
  inject,
  DOCUMENT,
  viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBase } from '../../../base/gp-base';
import { ZIndexService } from '../../../overlay/z-index.service';
import { GpProgressSpinner } from '../../feedback/progress-spinner/progress-spinner';
import { GpIcon } from '../../../icons/icon';
import { GpBlockUITarget } from '../../../services/block-ui.interface';
import { GpBlockUIService } from '../../../services/block-ui.service';

/**
 * Enterprise BlockUI Component.
 * Blocks user interaction across either the entire document or a targeted container component/element.
 */
@Component({
  selector: 'gp-block-ui',
  standalone: true,
  imports: [CommonModule, GpProgressSpinner, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './block-ui.html',
  styleUrl: './block-ui.scss'
})
export class GpBlockUI extends GpBase {
  private el = inject(ElementRef);
  private document = inject(DOCUMENT);
  private zIndexService = inject(ZIndexService);
  private blockUiService = inject(GpBlockUIService);

  /** Whether user interaction is blocked */
  public blocked = input<boolean>(false);

  /**
   * Target container to block:
   * - Omit, null, undefined, 'document', or 'body' to block the entire viewport.
   * - CSS selector string (e.g. '#userCard', '.panel-section') to block a specific container.
   * - ElementRef or HTMLElement reference.
   */
  public target = input<GpBlockUITarget>(undefined);

  /** Optional registration name for programmatic control via GpBlockUIService */
  public name = input<string>('');

  /** Optional message displayed below the loading indicator */
  public message = input<string>('');

  /** Optional custom icon name */
  public icon = input<string>('');

  /** Whether to render a spinner. Defaults to true */
  public spinner = input<boolean>(true);

  /** Size of the spinner. Defaults to '2.5rem' */
  public spinnerSize = input<string>('2.5rem');

  /** Whether to apply a backdrop blur effect. Defaults to false */
  public blur = input<boolean>(false);

  /** Whether to animate overlay entrance. Defaults to true */
  public animate = input<boolean>(true);

  /** Whether to automatically assign an elevated z-index */
  public autoZIndex = input<boolean>(true);

  /** Base starting z-index when autoZIndex is false */
  public baseZIndex = input<number>(1100);

  /** Custom inline style object */
  public customStyle = input<{ [key: string]: any } | null>(null, { alias: 'style' });

  // Event Outputs
  public onBlocked = output<void>();
  public onUnblocked = output<void>();

  // Template Reference
  public maskEl = viewChild<ElementRef<HTMLElement>>('mask');

  private resolvedTargetElement: HTMLElement | null = null;
  private originalParent: Node | null = null;
  private wasBlocked = false;

  /**
   * Computes whether this BlockUI is currently blocking the whole document.
   */
  public isDocumentTarget = computed(() => {
    const t = this.target();
    return !t || t === 'document' || t === 'body';
  });

  /**
   * Evaluates effective blocked status combining component input and GpBlockUIService state.
   */
  public isEffectivelyBlocked = computed(() => {
    if (this.blocked()) {
      return true;
    }

    const namedTarget = this.name();
    if (namedTarget && this.blockUiService.isBlocked(namedTarget)) {
      return true;
    }

    if (this.isDocumentTarget() && this.blockUiService.isGlobalBlocked()) {
      return true;
    }

    return false;
  });

  /**
   * Evaluates dynamic z-index for the overlay mask.
   */
  public currentZIndex = computed(() => {
    if (this.autoZIndex()) {
      return this.zIndexService.get(this.isDocumentTarget() ? 'modal' : 'overlay');
    }
    return this.baseZIndex();
  });

  constructor() {
    super();

    // React to blocking state changes
    effect(() => {
      const isBlocked = this.isEffectivelyBlocked();
      if (isBlocked && !this.wasBlocked) {
        this.wasBlocked = true;
        this.handleBlockActivated();
      } else if (!isBlocked && this.wasBlocked) {
        this.wasBlocked = false;
        this.handleBlockDeactivated();
      }
    });
  }

  override onAfterViewInit(): void {
    if (this.isEffectivelyBlocked() && !this.wasBlocked) {
      this.wasBlocked = true;
      this.handleBlockActivated();
    }
  }

  override onDestroy(): void {
    this.cleanupTarget();
    if (this.originalParent && this.el.nativeElement.parentNode !== this.originalParent) {
      this.originalParent.appendChild(this.el.nativeElement);
    }
  }

  /**
   * Resolves target element and mounts overlay.
   */
  private handleBlockActivated(): void {
    this.mountToTarget();
    this.onBlocked.emit();
  }

  private handleBlockDeactivated(): void {
    this.cleanupTarget();
    this.onUnblocked.emit();
  }

  /**
   * Resolves the target container DOM element based on target input.
   */
  private resolveTarget(): HTMLElement | null {
    const t = this.target();
    if (!t || t === 'document' || t === 'body') {
      return this.document.body;
    }

    if (typeof t === 'string') {
      return (this.document.querySelector(t) as HTMLElement | null) || null;
    }

    if (t instanceof ElementRef) {
      return t.nativeElement as HTMLElement;
    }

    if (t instanceof HTMLElement) {
      return t;
    }

    return null;
  }

  /**
   * Mounts the overlay inside the resolved target container.
   */
  private mountToTarget(): void {
    const targetEl = this.resolveTarget();
    this.resolvedTargetElement = targetEl;

    if (!targetEl) {
      return;
    }

    const host = this.el.nativeElement as HTMLElement;
    if (host && !this.originalParent && host.parentNode) {
      this.originalParent = host.parentNode;
    }

    // Mark accessibility busy state
    targetEl.setAttribute('aria-busy', 'true');

    if (!this.isDocumentTarget()) {
      // Ensure target element creates a positioning context for absolute positioning
      targetEl.classList.add('gp-block-ui-target');

      // Append component host into target if not already inside it
      if (host && host.parentNode !== targetEl) {
        targetEl.appendChild(host);
      }
    }
  }

  /**
   * Removes busy attributes and resets positioning classes.
   */
  private cleanupTarget(): void {
    if (this.resolvedTargetElement) {
      this.resolvedTargetElement.removeAttribute('aria-busy');
      this.resolvedTargetElement.classList.remove('gp-block-ui-target');
      this.resolvedTargetElement = null;
    }
  }

  /**
   * Mask click event handler. Stops propagation to prevent accidental clicks passing through.
   */
  public onMaskClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
