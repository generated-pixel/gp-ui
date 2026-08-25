import { Directive, Input } from '@angular/core';
import { UniqueId } from '../utils/unique-id';

/**
 * Base Component for all gp-ui UI components.
 * Provides consistent id generation, custom styling hooks, accessibility, and disabled state.
 */
@Directive()
export abstract class GpBaseComponent {
  /** Unique element identifier */
  @Input() id: string = UniqueId.generate('gp_');

  /** Custom CSS classes applied to host or root container */
  @Input() styleClass = '';

  /** Custom inline styles applied to host or root container */
  @Input() style: { [klass: string]: any } | null = null;

  /** Accessible label for screen readers */
  @Input() ariaLabel = '';

  /** Disabled state */
  @Input() disabled = false;
}
