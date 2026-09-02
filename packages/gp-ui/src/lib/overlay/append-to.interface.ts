import { ElementRef } from '@angular/core';

/**
 * Valid targets for attaching overlays and popups into the DOM.
 * - 'body': Appends to document.body (default)
 * - 'self': Keeps the element in its local component template hierarchy
 * - HTMLElement | ElementRef: Appends to the specified DOM node
 * - string: Appends to the element matching the query selector (e.g. '#modal-root', '.custom-container')
 */
export type GpAppendToTarget = 'body' | 'self' | HTMLElement | ElementRef | string | null | undefined;

export type GpOverlayPlacement = 'bottom' | 'top' | 'left' | 'right' | 'auto';
