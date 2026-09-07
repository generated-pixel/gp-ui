import { ElementRef } from '@angular/core';

/**
 * Valid target descriptors for blocking:
 * - 'document' | 'body' | undefined | null: blocks the entire document viewport
 * - string: CSS selector for a target element (e.g. '#myPanel', '.data-card')
 * - HTMLElement: direct DOM element reference
 * - ElementRef: Angular ElementRef wrapper
 */
export type GpBlockUITarget = string | HTMLElement | ElementRef | 'document' | 'body' | undefined | null;

/**
 * Options for configuring BlockUI behavior and visual styling.
 */
export interface GpBlockUIOptions {
  /** Text message displayed below the loading indicator */
  message?: string;
  /** Custom icon to render */
  icon?: string;
  /** Whether to show the loading spinner. Defaults to true */
  spinner?: boolean;
  /** Size of the spinner. Defaults to '2.5rem' */
  spinnerSize?: string;
  /** Whether to apply a backdrop blur effect. Defaults to false */
  blur?: boolean;
  /** Whether to animate overlay transitions. Defaults to true */
  animate?: boolean;
  /** Whether to automatically assign elevated z-index */
  autoZIndex?: boolean;
  /** Base starting z-index when autoZIndex is false */
  baseZIndex?: number;
  /** Custom CSS classes for the overlay */
  styleClass?: string;
  /** Custom inline styles */
  style?: { [key: string]: any };
  /** Accessible label for screen readers */
  ariaLabel?: string;
}

/**
 * Internal state for blocked target or global viewport.
 */
export interface GpBlockUIState {
  blocked: boolean;
  options?: GpBlockUIOptions;
}
