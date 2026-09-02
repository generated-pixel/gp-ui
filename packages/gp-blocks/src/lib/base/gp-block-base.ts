import { Directive, input, output } from '@angular/core';
import { GpBase } from '@generatedpixel/gp-ui';
import { GpFormAction } from '../schema/schema.types';

/**
 * Base class for all gp-blocks schema-driven blocks and UI templates.
 * Provides unified schema binding, action dispatching, and loading states.
 */
@Directive()
export abstract class GpBlockBase<TSchema = any> extends GpBase {
  /** The schema defining this block's structure and metadata */
  public schema = input<TSchema | undefined>(undefined);

  /** Loading state indicator */
  public loading = input<boolean>(false);

  /** Output emitted when an interactive action button or trigger in the block is clicked */
  public actionClick = output<GpFormAction>();

  /**
   * Dispatches an action event.
   */
  public onActionClick(action: GpFormAction): void {
    this.actionClick.emit(action);
  }
}
