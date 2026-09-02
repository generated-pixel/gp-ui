import { Component } from '@angular/core';

import {
  GpCardComponent,
  GpPanelComponent,
  GpAccordionComponent,
  GpAccordionTabComponent,
  GpFieldsetComponent,
  GpDividerComponent,
  GpSplitterComponent,
  GpSplitterPanelComponent,
  GpButtonComponent
} from 'gp-ui';
import { DocCodeComponent } from '../../shared/doc-code.component';
import { DocApiTableComponent, DocApiProperty } from '../../shared/doc-api-table.component';

@Component({
  selector: 'app-panels-demo',
  standalone: true,
  imports: [
    GpCardComponent,
    GpPanelComponent,
    GpAccordionComponent,
    GpAccordionTabComponent,
    GpFieldsetComponent,
    GpDividerComponent,
    GpSplitterComponent,
    GpSplitterPanelComponent,
    GpButtonComponent,
    DocCodeComponent,
    DocApiTableComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Panel & Layout Containers</h1>
        <p class="page-desc">
          Structured grouping containers including Cards, Collapsible Panels, Accordions, Grouped Fieldsets, Content
          Dividers, Resizable Splitters, and Scroll Panels.
        </p>
      </div>

      <!-- Import Section -->
      <div class="doc-section">
        <h2 class="doc-section-title">Import</h2>
        <p class="doc-section-desc">Import container components into your application:</p>
        <doc-code [code]="importCode" language="typescript" />
      </div>

      <!-- Card -->
      <div class="doc-section">
        <h2 class="doc-section-title">Card Container</h2>
        <p class="doc-section-desc">
          Cards provide an elevated visual boundary with optional header, subheader, and footer action slots.
        </p>
        <div style="max-width: 24rem;">
          <gp-card header="Advanced Card" subheader="Card subtitle" [hoverable]="true">
            <p>Cards provide a flexible container for grouping related content and actions.</p>
            <div footer>
              <gp-button label="Action" size="sm" />
              <gp-button label="Cancel" variant="outlined" severity="secondary" size="sm" />
            </div>
          </gp-card>
        </div>
        <doc-code [code]="cardCode" language="html" />
      </div>

      <!-- Collapsible Panel & Fieldset -->
      <div class="doc-section">
        <h2 class="doc-section-title">Panel & Fieldset</h2>
        <p class="doc-section-desc">Collapsible containers for organizing large views into expandable sections.</p>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <gp-panel header="Toggleable Panel" [toggleable]="true">
            <p>This panel can be expanded and collapsed dynamically.</p>
          </gp-panel>

          <gp-fieldset legend="Toggleable Fieldset" [toggleable]="true">
            <p>Fieldsets group form controls or descriptive information with clean legend borders.</p>
          </gp-fieldset>
        </div>
        <doc-code [code]="panelCode" language="html" />
      </div>

      <!-- Accordion -->
      <div class="doc-section">
        <h2 class="doc-section-title">Accordion</h2>
        <p class="doc-section-desc">Stacked panels with single or multiple concurrent tab expansion.</p>
        <gp-accordion [multiple]="true">
          <gp-accordion-tab header="Section 1: Architecture" [selected]="true">
            <p>
              gp-ui is built from scratch as an independent Angular component library using modern Angular practices.
            </p>
          </gp-accordion-tab>
          <gp-accordion-tab header="Section 2: Theming Tokens">
            <p>CSS custom properties drive all visual styles across light and dark modes.</p>
          </gp-accordion-tab>
          <gp-accordion-tab header="Section 3: Accessibility">
            <p>Every component is engineered with semantic HTML and WCAG ARIA compliance.</p>
          </gp-accordion-tab>
        </gp-accordion>
        <doc-code [code]="accordionCode" language="html" />
      </div>

      <!-- Splitter & Divider -->
      <div class="doc-section">
        <h2 class="doc-section-title">Splitter & Divider</h2>
        <p class="doc-section-desc">Resizable multi-pane layouts and content dividers with text alignment.</p>
        <gp-divider align="center">OR</gp-divider>

        <div style="height: 12rem; margin-top: 1rem;">
          <gp-splitter>
            <gp-splitter-panel [size]="40">
              <h4>Left Pane</h4>
              <p>Content on the left panel.</p>
            </gp-splitter-panel>
            <gp-splitter-panel [size]="60">
              <h4>Right Pane</h4>
              <p>Content on the right panel.</p>
            </gp-splitter-panel>
          </gp-splitter>
        </div>
        <doc-code [code]="splitterCode" language="html" />
      </div>

      <!-- API Reference -->
      <div class="doc-section">
        <h2 class="doc-section-title">API Reference</h2>
        <doc-api-table title="GpCardComponent Properties (Inputs)" [properties]="cardProperties" />
        <doc-api-table title="GpAccordionComponent Properties (Inputs)" [properties]="accordionProperties" />
      </div>
    </div>
  `
})
export class PanelsDemoComponent {
  importCode = `import {
  GpCardComponent,
  GpPanelComponent,
  GpAccordionComponent,
  GpAccordionTabComponent,
  GpFieldsetComponent,
  GpDividerComponent,
  GpSplitterComponent
} from '@generatedpixel/gp-ui';`;

  cardCode = `<gp-card header="Card Title" subheader="Card Subtitle" [hoverable]="true">
  <p>Body content goes here...</p>
  <div footer>
    <gp-button label="Save" />
  </div>
</gp-card>`;

  panelCode = `<gp-panel header="Toggleable Panel" [toggleable]="true">
  <p>Panel collapsible content...</p>
</gp-panel>`;

  accordionCode = `<gp-accordion [multiple]="true">
  <gp-accordion-tab header="Tab 1" [selected]="true">Content 1</gp-accordion-tab>
  <gp-accordion-tab header="Tab 2">Content 2</gp-accordion-tab>
</gp-accordion>`;

  splitterCode = `<gp-splitter>
  <gp-splitter-panel [size]="40">Left</gp-splitter-panel>
  <gp-splitter-panel [size]="60">Right</gp-splitter-panel>
</gp-splitter>`;

  cardProperties: DocApiProperty[] = [
    { name: 'header', type: 'string', default: "''", description: 'Main title displayed in the card header.' },
    { name: 'subheader', type: 'string', default: "''", description: 'Subtitle text displayed beneath the header.' },
    {
      name: 'hoverable',
      type: 'boolean',
      default: 'false',
      description: 'Applies interactive elevation shadow on hover.'
    },
    { name: 'styleClass', type: 'string', default: "''", description: 'Custom CSS classes for the card.' }
  ];

  accordionProperties: DocApiProperty[] = [
    {
      name: 'multiple',
      type: 'boolean',
      default: 'false',
      description: 'Allows multiple accordion tabs to be opened simultaneously.'
    },
    { name: 'styleClass', type: 'string', default: "''", description: 'Custom CSS class for the accordion wrapper.' }
  ];
}
