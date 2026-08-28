import { Directive, input } from '@angular/core';
import { UniqueId } from '../utils/unique-id';

/**
 * Base Component for all gp-ui UI components.
 * Provides consistent id generation, custom styling hooks, accessibility, and disabled state.
 */
@Directive()
export abstract class GpBaseComponent {
  /** Unique element identifier */
  public id = input<string>(UniqueId.generate('gp_'));

  /** Custom CSS classes applied to host or root container */
  public styleClass = input<string>('');

  /** Custom inline styles applied to host or root container */
  public style = input<{ [klass: string]: any } | null>(null);

  /** Accessible label for screen readers */
  public ariaLabel = input<string>('');

  /** Disabled state */
  public disabled = input<boolean>(false);
}
