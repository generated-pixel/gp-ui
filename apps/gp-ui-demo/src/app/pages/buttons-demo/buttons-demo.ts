import { Component } from '@angular/core';

import { GpButton, GpButtonGroup, GpSplitButton, GpSpeedDial, GpToggleButton, GpMenuItem } from 'gp-ui';
import { DocCode } from '../../shared/doc-code';
import { DocApiTable, DocApiProperty } from '../../shared/doc-api-table';
import { getComponentDoc } from '../component-docs/component-docs.data';

@Component({
  selector: 'app-buttons-demo',
  standalone: true,
  imports: [GpButton, GpButtonGroup, GpSplitButton, GpSpeedDial, GpToggleButton, DocCode, DocApiTable],
  templateUrl: './buttons-demo.html',
  styleUrl: './buttons-demo.scss'
})
export class ButtonsDemo {
  importCode = `import {
  GpButton,
  GpButtonGroup,
  GpSplitButton,
  GpSpeedDial,
  GpToggleButton
} from '@generatedpixel/gp-ui';`;

  severityCode = `<gp-button label="Primary" severity="primary" />
<gp-button label="Secondary" severity="secondary" />
<gp-button label="Success" severity="success" />
<gp-button label="Info" severity="info" />
<gp-button label="Warning" severity="warning" />
<gp-button label="Danger" severity="danger" />
<gp-button label="Contrast" severity="contrast" />`;

  variantsCode = `<gp-button label="Filled" variant="filled" severity="primary" />
<gp-button label="Outlined" variant="outlined" severity="primary" />
<gp-button label="Text" variant="text" severity="primary" />
<gp-button label="Tonal" variant="tonal" severity="primary" />`;

  iconsCode = `<gp-button label="Search" icon="search" severity="primary" />
<gp-button label="Upload" icon="upload" iconPos="right" severity="secondary" />
<gp-button icon="check" [iconOnly]="true" severity="success" />
<gp-button icon="trash" [iconOnly]="true" [rounded]="true" severity="danger" />
<gp-button label="Saving..." [loading]="true" severity="primary" />`;

  groupsCode = `<gp-button-group>
  <gp-button label="Left" severity="secondary" />
  <gp-button label="Middle" severity="secondary" />
  <gp-button label="Right" severity="secondary" />
</gp-button-group>

<gp-split-button label="Save Document" icon="check" [model]="splitItems" severity="primary" />
<gp-toggle-button onLabel="Active" offLabel="Inactive" onIcon="check" offIcon="times" />`;

  speedDialCode = '<gp-speed-dial [model]="speedDialItems" direction="up" />';

  splitItems: GpMenuItem[] = [
    { label: 'Update', icon: 'refresh' },
    { label: 'Delete', icon: 'trash' },
    { separator: true },
    { label: 'Quit', icon: 'times' }
  ];

  speedDialItems: GpMenuItem[] = [
    { label: 'Add', icon: 'plus' },
    { label: 'Edit', icon: 'edit' },
    { label: 'Delete', icon: 'trash' }
  ];

  buttonProperties: DocApiProperty[] = getComponentDoc('button')?.properties ?? [];
  buttonEvents: DocApiProperty[] = getComponentDoc('button')?.events ?? [];
  splitButtonProperties: DocApiProperty[] = getComponentDoc('split-button')?.properties ?? [];
  speedDialProperties: DocApiProperty[] = getComponentDoc('speed-dial')?.properties ?? [];
  toggleButtonProperties: DocApiProperty[] = getComponentDoc('toggle-button')?.properties ?? [];
}
