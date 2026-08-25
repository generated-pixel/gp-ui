import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpCardComponent,
  GpPanelComponent,
  GpAccordionComponent,
  GpAccordionTabComponent,
  GpFieldsetComponent,
  GpDividerComponent,
  GpSplitterComponent,
  GpSplitterPanelComponent,
  GpScrollPanelComponent,
  GpButtonComponent
} from 'gp-ui';

@Component({
  selector: 'app-panels-demo',
  standalone: true,
  imports: [
    CommonModule,
    GpCardComponent,
    GpPanelComponent,
    GpAccordionComponent,
    GpAccordionTabComponent,
    GpFieldsetComponent,
    GpDividerComponent,
    GpSplitterComponent,
    GpSplitterPanelComponent,
    GpScrollPanelComponent,
    GpButtonComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Panels & Container Components</h1>
        <p class="page-desc">Card, Collapsible Panel, Accordion, Fieldset, Divider, Splitter, and ScrollPanel.</p>
      </div>

      <!-- Card -->
      <div class="doc-section">
        <h2 class="doc-section-title">Card</h2>
        <div style="max-width: 24rem;">
          <gp-card header="Advanced Card" subheader="Card subtitle" [hoverable]="true">
            <p>Cards provide a flexible container for grouping related content and actions.</p>
            <div footer>
              <gp-button label="Action" size="sm" />
              <gp-button label="Cancel" variant="outlined" severity="secondary" size="sm" />
            </div>
          </gp-card>
        </div>
      </div>

      <!-- Collapsible Panel & Fieldset -->
      <div class="doc-section">
        <h2 class="doc-section-title">Panel & Fieldset</h2>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <gp-panel header="Toggleable Panel" [toggleable]="true">
            <p>This panel can be expanded and collapsed dynamically.</p>
          </gp-panel>

          <gp-fieldset legend="Toggleable Fieldset" [toggleable]="true">
            <p>Fieldsets group form controls or descriptive information with clean legend borders.</p>
          </gp-fieldset>
        </div>
      </div>

      <!-- Accordion -->
      <div class="doc-section">
        <h2 class="doc-section-title">Accordion</h2>
        <gp-accordion [multiple]="true">
          <gp-accordion-tab header="Section 1: Architecture" [selected]="true">
            <p>gp-ui is built from scratch as an independent Angular component library using modern Angular practices.</p>
          </gp-accordion-tab>
          <gp-accordion-tab header="Section 2: Theming Tokens">
            <p>CSS custom properties drive all visual styles across light and dark modes.</p>
          </gp-accordion-tab>
          <gp-accordion-tab header="Section 3: Accessibility">
            <p>Every component is engineered with semantic HTML and WCAG ARIA compliance.</p>
          </gp-accordion-tab>
        </gp-accordion>
      </div>

      <!-- Splitter & Divider -->
      <div class="doc-section">
        <h2 class="doc-section-title">Splitter & Divider</h2>
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
      </div>
    </div>
  `
})
export class PanelsDemoComponent {}
