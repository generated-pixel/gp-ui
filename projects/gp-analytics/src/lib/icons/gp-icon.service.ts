import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { GpIconName } from './gp-icon-names';
import { GP_ICON_REGISTRY } from './gp-icon-registry';

export type GpIconGroup =
  | 'artifact'
  | 'graph'
  | 'type'
  | 'aggregation'
  | 'role'
  | 'sort'
  | 'general';

/**
 * Provides pre-sanitized {@link SafeHtml} for every icon in the registry.
 *
 * All SVG inner-content is sourced entirely from the internal
 * {@link GP_ICON_REGISTRY} constant — never from user input — so
 * `bypassSecurityTrustHtml` is safe to call here.
 *
 * Icons are sanitized once on service construction and cached for the
 * lifetime of the application; repeated lookups cost only a Map read.
 */
@Injectable({ providedIn: 'root' })
export class GpIconService {
  private readonly sanitizer = inject(DomSanitizer);

  /** Pre-built SafeHtml cache, keyed by icon name. */
  private readonly cache = new Map<GpIconName, SafeHtml>();
  private readonly names: readonly GpIconName[];
  private readonly namesByGroup: Readonly<Record<GpIconGroup, readonly GpIconName[]>>;

  constructor() {
    const names = Object.freeze(Object.keys(GP_ICON_REGISTRY) as GpIconName[]);
    this.names = names;

    this.namesByGroup = Object.freeze({
      artifact: Object.freeze(names.filter((name) => name.startsWith('artifact-'))),
      graph: Object.freeze(names.filter((name) => name.startsWith('graph-'))),
      type: Object.freeze(names.filter((name) => name.startsWith('type-'))),
      aggregation: Object.freeze(names.filter((name) => name.startsWith('agg-'))),
      role: Object.freeze(names.filter((name) => name.startsWith('role-'))),
      sort: Object.freeze(names.filter((name) => name.startsWith('sort-'))),
      general: Object.freeze(
        names.filter(
          (name) =>
            !name.startsWith('artifact-') &&
            !name.startsWith('graph-') &&
            !name.startsWith('type-') &&
            !name.startsWith('agg-') &&
            !name.startsWith('role-') &&
            !name.startsWith('sort-'),
        ),
      ),
    });

    names.forEach((name) => {
      this.cache.set(name, this.sanitizer.bypassSecurityTrustHtml(GP_ICON_REGISTRY[name]));
    });
  }

  /** Returns all registered icon names. */
  getAllNames(): readonly GpIconName[] {
    return this.names;
  }

  /** Returns icon names for a specific semantic group. */
  getNamesForGroup(group: GpIconGroup): readonly GpIconName[] {
    return this.namesByGroup[group];
  }

  /**
   * Returns the sanitized SVG inner-content for the given icon name.
   * Returns an empty SafeHtml string if the name is not found (should not
   * happen in practice because {@link GpIconName} is exhaustively typed).
   */
  getSvg(name: GpIconName): SafeHtml {
    return this.cache.get(name) ?? this.sanitizer.bypassSecurityTrustHtml('');
  }
}
