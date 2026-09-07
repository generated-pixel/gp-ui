import { Component } from '@angular/core';

import {
  GpCard,
  GpPanel,
  GpAccordion,
  GpAccordionTab,
  GpFieldset,
  GpDivider,
  GpSplitter,
  GpSplitterPanel,
  GpButton
} from 'gp-ui';
import { DocCode } from '../../shared/doc-code';
import { DocApiTable, DocApiProperty } from '../../shared/doc-api-table';
import { getComponentDoc } from '../component-docs/component-docs.data';

@Component({
  selector: 'app-panels-demo',
  standalone: true,
  imports: [
    GpCard,
    GpPanel,
    GpAccordion,
    GpAccordionTab,
    GpFieldset,
    GpDivider,
    GpSplitter,
    GpSplitterPanel,
    GpButton,
    DocCode,
    DocApiTable
  ],
  templateUrl: './panels-demo.html',
  styleUrl: './panels-demo.scss'
})
export class PanelsDemo {
  importCode = `import {
  GpCard,
  GpPanel,
  GpAccordion,
  GpAccordionTab,
  GpFieldset,
  GpDivider,
  GpSplitter
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

  cardProperties: DocApiProperty[] = getComponentDoc('card')?.properties ?? [];
  panelProperties: DocApiProperty[] = getComponentDoc('panel')?.properties ?? [];
  accordionProperties: DocApiProperty[] = getComponentDoc('accordion')?.properties ?? [];
  fieldsetProperties: DocApiProperty[] = getComponentDoc('fieldset')?.properties ?? [];
  dividerProperties: DocApiProperty[] = getComponentDoc('divider')?.properties ?? [];
  splitterProperties: DocApiProperty[] = getComponentDoc('splitter')?.properties ?? [];
}
