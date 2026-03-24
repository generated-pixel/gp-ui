/**
 * Ensures icon-only buttons expose an accessible name via aria-label or title.
 *
 * A button is considered icon-only when:
 *  - it contains a <gp-icon>, and
 *  - its visible text content is empty after trimming.
 */
export function assertIconOnlyButtonsHaveAccessibleText(root: ParentNode): void {
  const buttons = Array.from(root.querySelectorAll('button')) as HTMLButtonElement[];

  buttons.forEach((button, index) => {
    const hasIcon = button.querySelector('gp-icon') !== null;
    if (!hasIcon) {
      return;
    }

    const visibleText = (button.textContent ?? '').trim();
    if (visibleText.length > 0) {
      return;
    }

    const ariaLabel = (button.getAttribute('aria-label') ?? '').trim();
    const title = (button.getAttribute('title') ?? '').trim();
    const hasAccessibleText = ariaLabel.length > 0 || title.length > 0;

    if (!hasAccessibleText) {
      throw new Error(`Icon-only button at index ${index} is missing both aria-label and title.`);
    }
  });
}

/**
 * Ensures toggle buttons expose a valid `aria-expanded` state.
 *
 * By default at least one toggle is expected. Pass `minCount = 0` when a
 * component can legitimately render with no toggle controls.
 */
export function assertToggleButtonsHaveValidAriaExpanded(root: ParentNode, minCount = 1): void {
  const toggles = Array.from(root.querySelectorAll('button[aria-expanded]')) as HTMLButtonElement[];

  if (toggles.length < minCount) {
    throw new Error(
      `Expected at least ${minCount} toggle button(s) with aria-expanded, found ${toggles.length}.`,
    );
  }

  toggles.forEach((button, index) => {
    const value = button.getAttribute('aria-expanded');
    if (value !== 'true' && value !== 'false') {
      throw new Error(
        `Toggle button at index ${index} has invalid aria-expanded value: ${String(value)}.`,
      );
    }
  });
}

/**
 * Ensures buttons with `aria-controls` point to existing element ids.
 *
 * By default at least one control is expected. Pass `minCount = 0` for views
 * that can legitimately render with no controlling buttons.
 */
export function assertAriaControlsTargetsExist(root: ParentNode, minCount = 1): void {
  const controls = Array.from(
    root.querySelectorAll('button[aria-controls]'),
  ) as HTMLButtonElement[];

  if (controls.length < minCount) {
    throw new Error(
      `Expected at least ${minCount} button(s) with aria-controls, found ${controls.length}.`,
    );
  }

  controls.forEach((button, index) => {
    const controlsValue = (button.getAttribute('aria-controls') ?? '').trim();
    if (!controlsValue) {
      throw new Error(`Button at index ${index} has an empty aria-controls value.`);
    }

    const ids = controlsValue.split(/\s+/).filter(Boolean);
    ids.forEach((id) => {
      const target = root.querySelector(`#${id}`);
      if (!target) {
        throw new Error(
          `Button at index ${index} references missing aria-controls target id: ${id}.`,
        );
      }
    });
  });
}
