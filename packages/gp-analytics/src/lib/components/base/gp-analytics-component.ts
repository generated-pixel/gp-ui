import { Directive } from '@angular/core';
import { GpAnalyticsBase } from './gp-analytics-base';

/**
 * Foundational component class for all gp-analytics components, extending GpAnalyticsBase.
 * Maintains complete backwards compatibility while providing the standard GpBase architecture.
 */
@Directive()
export abstract class GpAnalyticsComponent extends GpAnalyticsBase {}
