import {
  Directive,
  ElementRef,
  input,
  output,
  effect,
  inject,
  DOCUMENT,
  OnDestroy,
  Renderer2,
  computed
} from '@angular/core';
import { ZIndexService } from '../../../overlay/z-index.service';
import { GpBlockUIService } from '../../../services/block-ui.service';

/**
 * Enterprise BlockUI Directive.
 * Can be attached directly to any container element or component:
 * `<div [gpBlockUI]="isLoading" [blockUIMessage]="'Loading data...'">...</div>`
 * Or tied to the service:
 * `<div gpBlockUI [blockUIName]="'ordersCard'">...</div>`
 * Or directly by name:
 * `<div gpBlockUI="ordersCard">...</div>`
 */
@Directive({
  selector: '[gpBlockUI],[blockUIName]',
  standalone: true
})
export class GpBlockUIDirective implements OnDestroy {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);
  private zIndexService = inject(ZIndexService);
  private blockUiService = inject(GpBlockUIService, { optional: true });

  /** Whether the host container is currently blocked directly or name of target */
  public gpBlockUI = input<boolean | string>(false);

  /** Optional target name to link this directive to GpBlockUIService.block(name) */
  public blockUIName = input<string>('');

  /** Message displayed on the block overlay */
  public blockUIMessage = input<string>('');

  /** Custom icon displayed on the block overlay */
  public blockUIIcon = input<string>('');

  /** Whether to show a spinner. Defaults to true */
  public blockUISpinner = input<boolean>(true);

  /** Whether to apply backdrop blur. Defaults to false */
  public blockUIBlur = input<boolean>(false);

  /** Custom z-index override */
  public blockUIZIndex = input<number | undefined>(undefined);

  /** Custom CSS classes for the overlay */
  public blockUIClass = input<string>('');

  /** Emitted when blocking state changes */
  public gpBlockUIChange = output<boolean>();

  private overlayElement: HTMLElement | null = null;
  private stopOverlayClickListener: (() => void) | null = null;
  private wasBlocked = false;

  /**
   * Resolves the target name either from blockUIName input or gpBlockUI string input.
   */
  public effectiveTargetName = computed(() => {
    const name = this.blockUIName();
    if (name) {
      return name;
    }

    const val = this.gpBlockUI();
    if (typeof val === 'string' && val !== '') {
      return val;
    }

    return '';
  });

  /**
   * Computed effective blocked state combining input signal and GpBlockUIService state.
   */
  public isEffectivelyBlocked = computed(() => {
    const directVal = this.gpBlockUI();
    if (typeof directVal === 'boolean') {
      if (directVal) {
        return true;
      }
    }

    const target = this.effectiveTargetName();
    if (target && this.blockUiService) {
      return this.blockUiService.isBlocked(target);
    }

    // Presence-only attribute (gpBlockUI="") should not imply blocking; use [gpBlockUI]="true" instead.
    if (directVal === '' && !target) {
      return false;
    }

    return false;
  });

  constructor() {
    effect(() => {
      const isBlocked = this.isEffectivelyBlocked();
      if (isBlocked && !this.wasBlocked) {
        this.wasBlocked = true;
        this.mount();
        this.gpBlockUIChange.emit(true);
      } else if (!isBlocked && this.wasBlocked) {
        this.wasBlocked = false;
        this.unmount();
        this.gpBlockUIChange.emit(false);
      }
    });
  }

  public ngOnDestroy(): void {
    this.unmount();
  }

  private mount(): void {
    const host = this.el.nativeElement as HTMLElement;
    if (!host) {
      return;
    }

    if (this.overlayElement) {
      return;
    }

    const targetName = this.effectiveTargetName();
    const serviceOpts = targetName && this.blockUiService ? this.blockUiService.getOptions(targetName) : undefined;

    const effectiveBlur = this.blockUIBlur() || (serviceOpts?.blur ?? false);
    const effectiveSpinner = serviceOpts?.spinner !== undefined ? serviceOpts.spinner : this.blockUISpinner();
    const effectiveMsg = this.blockUIMessage() || serviceOpts?.message || '';

    // Ensure host creates local positioning context
    this.renderer.addClass(host, 'gp-block-ui-target');
    this.renderer.setAttribute(host, 'aria-busy', 'true');

    // Create overlay container
    const overlay = this.renderer.createElement('div') as HTMLElement;
    this.renderer.addClass(overlay, 'gp-block-ui');
    this.renderer.addClass(overlay, 'gp-block-ui--target');
    this.renderer.addClass(overlay, 'gp-block-ui--animate');

    if (effectiveBlur) {
      this.renderer.addClass(overlay, 'gp-block-ui--blur');
    }

    const customClass = this.blockUIClass() || serviceOpts?.styleClass || '';
    if (customClass) {
      for (const cls of customClass.split(' ').filter(Boolean)) {
        this.renderer.addClass(overlay, cls);
      }
    }

    const zIndex = this.blockUIZIndex() ?? serviceOpts?.baseZIndex ?? this.zIndexService.get('overlay');
    this.renderer.setStyle(overlay, 'z-index', String(zIndex));
    this.renderer.setAttribute(overlay, 'role', 'status');
    this.renderer.setAttribute(overlay, 'aria-live', 'polite');

    // Prevent click events from propagating to blocked host elements
    this.renderer.listen(overlay, 'click', (e: MouseEvent) => {
      e.stopPropagation();
    });

    // Content card
    const content = this.renderer.createElement('div');
    this.renderer.addClass(content, 'gp-block-ui__content');

    // Spinner
    if (effectiveSpinner) {
      const spinner = this.renderer.createElement('div');
      this.renderer.addClass(spinner, 'gp-progress-spinner');
      this.renderer.setStyle(spinner, 'width', '2.5rem');
      this.renderer.setStyle(spinner, 'height', '2.5rem');

      const svg = this.document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'gp-progress-spinner__svg');
      svg.setAttribute('viewBox', '25 25 50 50');

      const circle = this.document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', 'gp-progress-spinner__circle');
      circle.setAttribute('cx', '50');
      circle.setAttribute('cy', '50');
      circle.setAttribute('r', '20');
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke-width', '4');
      circle.setAttribute('stroke-miterlimit', '10');

      svg.appendChild(circle);
      spinner.appendChild(svg);
      this.renderer.appendChild(content, spinner);
    }

    // Message
    if (effectiveMsg) {
      const msgSpan = this.renderer.createElement('span');
      this.renderer.addClass(msgSpan, 'gp-block-ui__message');
      const textNode = this.renderer.createText(effectiveMsg);
      this.renderer.appendChild(msgSpan, textNode);
      this.renderer.appendChild(content, msgSpan);
    }

    this.renderer.appendChild(overlay, content);
    this.renderer.appendChild(host, overlay);
    this.overlayElement = overlay;
  }

  private unmount(): void {
    const host = this.el.nativeElement as HTMLElement;
    if (host) {
      this.renderer.removeClass(host, 'gp-block-ui-target');
      this.renderer.removeAttribute(host, 'aria-busy');
    }

    if (this.overlayElement && this.overlayElement.parentNode) {
      this.renderer.removeChild(this.overlayElement.parentNode, this.overlayElement);
      this.overlayElement = null;
    }
  }
}
