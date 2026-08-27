import { DocApiProperty } from '../../shared/doc-api-table.component';

export interface ComponentDocDefinition {
  slug: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  importStatement: string;
  exampleCode: string;
  properties: DocApiProperty[];
  events?: DocApiProperty[];
}

const baseComponentProperties: DocApiProperty[] = [
  { name: 'id', type: 'string', default: "UniqueId.generate('gp_')", description: 'Unique element identifier attached to the component.' },
  { name: 'styleClass', type: 'string', default: "''", description: 'Custom CSS class names applied to the component host.' },
  { name: 'style', type: '{ [klass: string]: any } | null', default: 'null', description: 'Custom inline styling applied to the root element.' },
  { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible label used for screen readers.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interactive behavior and user input.' }
];

const editableBaseProperties: DocApiProperty[] = [
  { name: 'value', type: 'any', default: 'null', description: 'Current value bound to the control.' },
  { name: 'name', type: 'string', default: "''", description: 'Form field name used by the surrounding form APIs.' },
  { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text shown when the field is empty.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Marks the field as required.' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Makes the control read-only.' },
  { name: 'invalid', type: 'boolean', default: 'false', description: 'Overrides the component validation state when set to true.' },
  { name: 'validators', type: 'GpValidatorFn<T>[]', default: '[]', description: 'Validator functions applied to the field value.' },
  { name: 'validateOn', type: "('change' | 'blur')[]", default: "['change', 'blur']", description: 'When the control validates during user interactions.' },
  { name: 'errorMessage', type: 'string', default: "''", description: 'Custom validation message used when validation fails.' },
  { name: 'helperText', type: 'string', default: "''", description: 'Additional context displayed below the field.' },
  { name: 'valueEffect', type: 'GpValueEffectFn<T>', default: 'undefined', description: 'Optional callback executed when the value updates.' }
];

const editableBaseEvents: DocApiProperty[] = [
  { name: 'valueChange', type: 'EventEmitter<T>', description: 'Emitted whenever the field value changes.' },
  { name: 'onValidate', type: 'EventEmitter<GpValidationState<T>>', description: 'Emitted after validation completes with the current validation state.' },
  { name: 'onValid', type: 'EventEmitter<T>', description: 'Emitted when the field passes validation.' },
  { name: 'onInvalid', type: 'EventEmitter<GpValidationError[]>', description: 'Emitted when validation fails and includes the error list.' },
  { name: 'onEffectComplete', type: 'EventEmitter<{ value: T; error?: any }>', description: 'Emitted after any value effect completes.' }
];

const editableDocSlugs = new Set<string>([
  'input-text',
  'textarea',
  'password',
  'input-number',
  'checkbox',
  'radio-button',
  'switch',
  'slider',
  'rating',
  'color-picker',
  'input-mask',
  'select',
  'multi-select',
  'listbox',
  'autocomplete',
  'cascade-select',
  'tree-select',
  'date-picker',
  'time-picker',
  'file-upload',
  'table'
]);

function withInheritedApi(doc: ComponentDocDefinition): ComponentDocDefinition {
  const includesEditableBase = editableDocSlugs.has(doc.slug);

  return {
    ...doc,
    properties: [...baseComponentProperties, ...(includesEditableBase ? editableBaseProperties : []), ...doc.properties],
    events: [...(includesEditableBase ? editableBaseEvents : []), ...(doc.events ?? [])]
  };
}

export const componentDocs: ComponentDocDefinition[] = [
  {
    slug: 'button',
    name: 'Button',
    category: 'Components',
    icon: 'check',
    description: 'Interactive actions with semantic severity, visual variants, and icon support.',
    importStatement: `import { GpButtonComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-button label="Primary" severity="primary" />\n<gp-button label="Outlined" variant="outlined" severity="secondary" />`,
    properties: [
      { name: 'label', type: 'string', default: "''", description: 'Text label displayed on the button.' },
      { name: 'severity', type: "'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'contrast'", default: "'primary'", description: 'Semantic color treatment.' },
      { name: 'variant', type: "'filled' | 'outlined' | 'text' | 'tonal' | 'elevated' | 'link'", default: "'filled'", description: 'Visual style for the button.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables user interaction.' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Displays a loading indicator and blocks clicks.' }
    ],
    events: [
      { name: 'onClickEvent', type: 'EventEmitter<MouseEvent>', description: 'Emitted when the button is clicked.' }
    ]
  },
  {
    slug: 'split-button',
    name: 'Split Button',
    category: 'Components',
    icon: 'check',
    description: 'A primary action paired with a contextual menu.',
    importStatement: `import { GpSplitButtonComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-split-button label="Save Document" icon="check" [model]="menuItems" severity="primary" />`,
    properties: [
      { name: 'label', type: 'string', default: "''", description: 'Main action label.' },
      { name: 'icon', type: 'string', default: "''", description: 'Primary icon on the main button.' },
      { name: 'severity', type: "'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'contrast'", default: "'primary'", description: 'Theme severity.' },
      { name: 'model', type: 'GpMenuItem[]', default: '[]', description: 'Menu items for the dropdown action list.' }
    ]
  },
  {
    slug: 'speed-dial',
    name: 'Speed Dial',
    category: 'Components',
    icon: 'check',
    description: 'Floating action menu for quick secondary actions.',
    importStatement: `import { GpSpeedDialComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-speed-dial [model]="quickActions" direction="up" />`,
    properties: [
      { name: 'model', type: 'GpMenuItem[]', default: '[]', description: 'Items displayed in the floating menu.' },
      { name: 'direction', type: "'up' | 'down' | 'left' | 'right'", default: "'up'", description: 'Expansion direction of the floating actions.' }
    ]
  },
  {
    slug: 'button-group',
    name: 'Button Group',
    category: 'Components',
    icon: 'layer-group',
    description: 'Grouped button controls for related actions and toggle-like sets.',
    importStatement: `import { GpButtonGroupComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-button-group>
  <gp-button label="One" severity="primary" />
  <gp-button label="Two" variant="outlined" severity="secondary" />
</gp-button-group>`,
    properties: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout orientation of the grouped buttons.' }
    ]
  },
  {
    slug: 'toggle-button',
    name: 'Toggle Button',
    category: 'Components',
    icon: 'toggle-on',
    description: 'Two-state button control for enable, disable, or toggled actions.',
    importStatement: `import { GpToggleButtonComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-toggle-button label="Bold" [value]="true" />`,
    properties: [
      { name: 'label', type: 'string', default: "''", description: 'Text shown for the toggle control.' },
      { name: 'value', type: 'boolean', default: 'false', description: 'Current toggle state.' }
    ]
  },
  {
    slug: 'paginator',
    name: 'Paginator',
    category: 'Data Presentation',
    icon: 'bars',
    description: 'Pagination control for navigating through large collections of content.',
    importStatement: `import { GpPaginatorComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-paginator [totalRecords]="200" [rows]="10" />`,
    properties: [
      { name: 'totalRecords', type: 'number', default: '0', description: 'Total number of items available.' },
      { name: 'rows', type: 'number', default: '0', description: 'Number of rows per page.' },
      { name: 'first', type: 'number', default: '0', description: 'Index of the first visible record.' }
    ]
  },
  {
    slug: 'column',
    name: 'Column',
    category: 'Data Presentation',
    icon: 'table',
    description: 'Table column definition used by data tables and grid layouts.',
    importStatement: `import { GpColumnComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-column field="name" header="Name" />`,
    properties: [
      { name: 'field', type: 'string', default: "''", description: 'Data key used for the column value.' },
      { name: 'header', type: 'string', default: "''", description: 'Header label displayed for the column.' }
    ]
  },
  {
    slug: 'tree-table',
    name: 'Tree Table',
    category: 'Data Presentation',
    icon: 'sitemap',
    description: 'Hierarchical table for nested rows and expandable content.',
    importStatement: `import { GpTreeTableComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-tree-table [value]="treeRows" />`,
    properties: [
      { name: 'value', type: 'any[]', default: '[]', description: 'Tree data rendered in the table.' },
      { name: 'selectionMode', type: 'string', default: "''", description: 'Selection mode used for row interaction.' }
    ]
  },
  {
    slug: 'data-view',
    name: 'Data View',
    category: 'Data Presentation',
    icon: 'list',
    description: 'Layout for viewing groups of data with flexible item templates.',
    importStatement: `import { GpDataViewComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-data-view [value]="items" layout="grid" />`,
    properties: [
      { name: 'value', type: 'any[]', default: '[]', description: 'Collection of items to render.' },
      { name: 'layout', type: "'list' | 'grid'", default: "'list'", description: 'How items are laid out.' }
    ]
  },
  {
    slug: 'virtual-scroller',
    name: 'Virtual Scroller',
    category: 'Data Presentation',
    icon: 'scroll',
    description: 'Efficient scrolling for large lists and virtualized item sets.',
    importStatement: `import { GpVirtualScrollerComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-virtual-scroller [value]="items" />`,
    properties: [
      { name: 'value', type: 'any[]', default: '[]', description: 'Items rendered in the scroller.' },
      { name: 'itemSize', type: 'number', default: '32', description: 'Approximate item height used for virtualization.' }
    ]
  },
  {
    slug: 'tree',
    name: 'Tree',
    category: 'Tree & Hierarchy',
    icon: 'folder-tree',
    description: 'Hierarchical tree list for navigable nested content.',
    importStatement: `import { GpTreeComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-tree [value]="nodes" selectionMode="single" />`,
    properties: [
      { name: 'value', type: 'GpTreeNode[]', default: '[]', description: 'Tree nodes to render.' },
      { name: 'selectionMode', type: 'GpTreeSelectionMode', default: 'null', description: 'How selection is handled in the tree.' }
    ]
  },
  {
    slug: 'org-chart',
    name: 'Org Chart',
    category: 'Tree & Hierarchy',
    icon: 'network',
    description: 'Organizational chart for hierarchical reporting and relationship mapping.',
    importStatement: `import { GpOrgChartComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-org-chart [value]="orgData" />`,
    properties: [
      { name: 'value', type: 'any[]', default: '[]', description: 'Structured hierarchy displayed in the chart.' }
    ]
  },
  {
    slug: 'menu',
    name: 'Menu',
    category: 'Navigation',
    icon: 'menu',
    description: 'Contextual menu for commands, actions, and grouped navigation items.',
    importStatement: `import { GpMenuComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-menu [model]="menuItems" />`,
    properties: [
      { name: 'model', type: 'GpMenuItem[]', default: '[]', description: 'Menu items displayed in the component.' }
    ]
  },
  {
    slug: 'menubar',
    name: 'Menubar',
    category: 'Navigation',
    icon: 'bars',
    description: 'Application nav bar built from grouped menu entries.',
    importStatement: `import { GpMenubarComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-menubar [model]="menuModel" />`,
    properties: [
      { name: 'model', type: 'GpMenuItem[]', default: '[]', description: 'Menu data used to render the menubar.' }
    ]
  },
  {
    slug: 'context-menu',
    name: 'Context Menu',
    category: 'Navigation',
    icon: 'context-menu',
    description: 'Action menu revealed from an element or mouse context.',
    importStatement: `import { GpContextMenuComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-context-menu [model]="contextActions" />`,
    properties: [
      { name: 'model', type: 'GpMenuItem[]', default: '[]', description: 'Actions shown in the menu.' }
    ]
  },
  {
    slug: 'tiered-menu',
    name: 'Tiered Menu',
    category: 'Navigation',
    icon: 'sitemap',
    description: 'Nested menu structure with parent/child action groups.',
    importStatement: `import { GpTieredMenuComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-tiered-menu [model]="menuTree" />`,
    properties: [
      { name: 'model', type: 'GpMenuItem[]', default: '[]', description: 'Hierarchical menu data source.' }
    ]
  },
  {
    slug: 'mega-menu',
    name: 'Mega Menu',
    category: 'Navigation',
    icon: 'grid',
    description: 'Large navigation surface for wide content groupings and cross-links.',
    importStatement: `import { GpMegaMenuComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-mega-menu [model]="megaItems" />`,
    properties: [
      { name: 'model', type: 'GpMenuItem[]', default: '[]', description: 'Navigation content grouped into a mega-menu layout.' }
    ]
  },
  {
    slug: 'panel-menu',
    name: 'Panel Menu',
    category: 'Navigation',
    icon: 'folder',
    description: 'Side panel navigation with nested item groups and expandable sections.',
    importStatement: `import { GpPanelMenuComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-panel-menu [model]="panelItems" />`,
    properties: [
      { name: 'model', type: 'GpMenuItem[]', default: '[]', description: 'Menu data for panel-style navigation.' }
    ]
  },
  {
    slug: 'breadcrumb',
    name: 'Breadcrumb',
    category: 'Navigation',
    icon: 'home',
    description: 'Path indicator showing the current location in a hierarchy.',
    importStatement: `import { GpBreadcrumbComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-breadcrumb [items]="crumbs" />`,
    properties: [
      { name: 'items', type: 'any[]', default: '[]', description: 'Breadcrumb items shown from root to current page.' }
    ]
  },
  {
    slug: 'stepper',
    name: 'Stepper',
    category: 'Navigation',
    icon: 'route',
    description: 'Multi-step progress indicator for onboarding and workflow flows.',
    importStatement: `import { GpStepperComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-stepper [steps]="steps" />`,
    properties: [
      { name: 'steps', type: 'any[]', default: '[]', description: 'Steps shown in sequence.' }
    ]
  },
  {
    slug: 'dock',
    name: 'Dock',
    category: 'Navigation',
    icon: 'dock',
    description: 'Docked navigation container for pinned actions or app shortcuts.',
    importStatement: `import { GpDockComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-dock [items]="dockItems" />`,
    properties: [
      { name: 'items', type: 'any[]', default: '[]', description: 'Actions pinned in the dock.' }
    ]
  },
  {
    slug: 'toolbar',
    name: 'Toolbar',
    category: 'Navigation',
    icon: 'tool',
    description: 'Action bar grouping commands, filters, and secondary controls.',
    importStatement: `import { GpToolbarComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-toolbar [items]="actions" />`,
    properties: [
      { name: 'items', type: 'any[]', default: '[]', description: 'Toolbar actions rendered in the bar.' }
    ]
  },
  {
    slug: 'confirm-dialog',
    name: 'Confirm Dialog',
    category: 'Overlays',
    icon: 'confirm',
    description: 'Confirmation overlay for destructive or irreversible actions.',
    importStatement: `import { GpConfirmDialogComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-confirm-dialog header="Delete" [visible]="true" />`,
    properties: [
      { name: 'header', type: 'string', default: "''", description: 'Dialog title shown in the header.' },
      { name: 'visible', type: 'boolean', default: 'false', description: 'Controls whether the confirmation prompt is visible.' }
    ]
  },
  {
    slug: 'drawer',
    name: 'Drawer',
    category: 'Overlays',
    icon: 'panel-right',
    description: 'Slide-over panel for contextual content and secondary workflows.',
    importStatement: `import { GpDrawerComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-drawer header="Filters" [visible]="true" />`,
    properties: [
      { name: 'header', type: 'string', default: "''", description: 'Drawer title text.' },
      { name: 'visible', type: 'boolean', default: 'false', description: 'Controls drawer visibility.' }
    ]
  },
  {
    slug: 'popover',
    name: 'Popover',
    category: 'Overlays',
    icon: 'message-circle',
    description: 'Floating content container anchored to a trigger element.',
    importStatement: `import { GpPopoverComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-popover content="Helpful details" />`,
    properties: [
      { name: 'content', type: 'string', default: "''", description: 'Popover content shown when opened.' }
    ]
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    category: 'Panels',
    icon: 'chevron-down',
    description: 'Collapsible stacked sections for compact content organization.',
    importStatement: `import { GpAccordionComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-accordion>
  <gp-accordion-tab header="Overview">...</gp-accordion-tab>
</gp-accordion>`,
    properties: [
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Allows multiple accordion panes to be open at once.' }
    ]
  },
  {
    slug: 'fieldset',
    name: 'Fieldset',
    category: 'Panels',
    icon: 'window',
    description: 'Semantically grouped form content presented as a labelled block.',
    importStatement: `import { GpFieldsetComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-fieldset legend="Profile">
  <gp-input-text label="Name" />
</gp-fieldset>`,
    properties: [
      { name: 'legend', type: 'string', default: "''", description: 'Title shown for the fieldset group.' }
    ]
  },
  {
    slug: 'divider',
    name: 'Divider',
    category: 'Panels',
    icon: 'separator',
    description: 'Horizontal or vertical rule used to separate content regions.',
    importStatement: `import { GpDividerComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-divider />`,
    properties: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Divider orientation.' }
    ]
  },
  {
    slug: 'splitter',
    name: 'Splitter',
    category: 'Panels',
    icon: 'resize',
    description: 'Resizable content panes for split layouts and workspaces.',
    importStatement: `import { GpSplitterComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-splitter>
  <gp-splitter-panel>Left</gp-splitter-panel>
  <gp-splitter-panel>Right</gp-splitter-panel>
</gp-splitter>`,
    properties: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Direction of the split.' }
    ]
  },
  {
    slug: 'scroll-panel',
    name: 'Scroll Panel',
    category: 'Panels',
    icon: 'scroll',
    description: 'Scrollable panel with stable layout for long-form or overflow-heavy content.',
    importStatement: `import { GpScrollPanelComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-scroll-panel style="height: 12rem;">Long content...</gp-scroll-panel>`,
    properties: [
      { name: 'scrollbars', type: 'string', default: "'auto'", description: 'Scrolling behavior for the panel.' }
    ]
  },
  {
    slug: 'toast',
    name: 'Toast',
    category: 'Feedback',
    icon: 'bell',
    description: 'Transient notification for success, warning, and status messages.',
    importStatement: `import { GpToastComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-toast severity="success" message="Saved successfully" />`,
    properties: [
      { name: 'message', type: 'string', default: "''", description: 'Toast content.' },
      { name: 'severity', type: "'success' | 'info' | 'warn' | 'error'", default: "'info'", description: 'Status tone of the message.' }
    ]
  },
  {
    slug: 'progress-bar',
    name: 'Progress Bar',
    category: 'Feedback',
    icon: 'progress',
    description: 'Linear progress indicator for task completion and loading states.',
    importStatement: `import { GpProgressBarComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-progress-bar [value]="70" />`,
    properties: [
      { name: 'value', type: 'number', default: '0', description: 'Current progress value between 0 and 100.' }
    ]
  },
  {
    slug: 'progress-spinner',
    name: 'Progress Spinner',
    category: 'Feedback',
    icon: 'spinner',
    description: 'Circular loading indicator for busy or pending background work.',
    importStatement: `import { GpProgressSpinnerComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-progress-spinner [value]="60" />`,
    properties: [
      { name: 'value', type: 'number', default: '0', description: 'Progress of the spinner if used for indeterminate or partial loading.' }
    ]
  },
  {
    slug: 'skeleton',
    name: 'Skeleton',
    category: 'Feedback',
    icon: 'shimmer',
    description: 'Placeholder shimmer used while content is loading.',
    importStatement: `import { GpSkeletonComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-skeleton width="12rem" height="1rem" />`,
    properties: [
      { name: 'width', type: 'string', default: "'100%'", description: 'Width of the skeleton placeholder.' },
      { name: 'height', type: 'string', default: "'1rem'", description: 'Height of the skeleton placeholder.' }
    ]
  },
  {
    slug: 'tag',
    name: 'Tag',
    category: 'Feedback',
    icon: 'tag',
    description: 'Label chip used for metadata, states, and inline classification.',
    importStatement: `import { GpTagComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-tag value="Beta" severity="secondary" />`,
    properties: [
      { name: 'value', type: 'string', default: "''", description: 'Tag label content.' },
      { name: 'severity', type: "'primary' | 'secondary' | 'success' | 'warning' | 'danger'", default: "'primary'", description: 'Visual emphasis for the tag.' }
    ]
  },
  {
    slug: 'chip',
    name: 'Chip',
    category: 'Display',
    icon: 'chip',
    description: 'Compact visual element for status, labels, or filter selections.',
    importStatement: `import { GpChipComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-chip label="New" />`,
    properties: [
      { name: 'label', type: 'string', default: "''", description: 'Text displayed inside the chip.' }
    ]
  },
  {
    slug: 'image',
    name: 'Image',
    category: 'Display',
    icon: 'image',
    description: 'Image media component with responsive sizing and fallback options.',
    importStatement: `import { GpImageComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-image src="/img/example.png" alt="Example" />`,
    properties: [
      { name: 'src', type: 'string', default: "''", description: 'Path for the image resource.' },
      { name: 'alt', type: 'string', default: "''", description: 'Alternative text for accessibility and fallback cases.' }
    ]
  },
  {
    slug: 'carousel',
    name: 'Carousel',
    category: 'Display',
    icon: 'slides',
    description: 'Rotating media or content slides for presentation and showcase layouts.',
    importStatement: `import { GpCarouselComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-carousel [items]="slides" />`,
    properties: [
      { name: 'items', type: 'any[]', default: '[]', description: 'Slide data rendered by the carousel.' }
    ]
  },
  {
    slug: 'timeline',
    name: 'Timeline',
    category: 'Display',
    icon: 'timeline',
    description: 'Temporal sequence for events, activities, and historical content.',
    importStatement: `import { GpTimelineComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-timeline [events]="history" />`,
    properties: [
      { name: 'events', type: 'any[]', default: '[]', description: 'Items displayed in order along the timeline.' }
    ]
  },
  {
    slug: 'meter-group',
    name: 'Meter Group',
    category: 'Display',
    icon: 'meter',
    description: 'Group of value meters representing allocations or progress summaries.',
    importStatement: `import { GpMeterGroupComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-meter-group [values]="[45, 30, 25]" />`,
    properties: [
      { name: 'values', type: 'number[]', default: '[]', description: 'Meter values shown across the group.' }
    ]
  },
  {
    slug: 'empty-state',
    name: 'Empty State',
    category: 'Display',
    icon: 'sparkles',
    description: 'Friendly placeholder for empty content areas with a clear call to action.',
    importStatement: `import { GpEmptyStateComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-empty-state title="No items yet" message="Start by creating your first record." />`,
    properties: [
      { name: 'title', type: 'string', default: "''", description: 'Primary heading shown in the empty state.' },
      { name: 'message', type: 'string', default: "''", description: 'Supporting descriptive text.' }
    ]
  },
  {
    slug: 'input-text',
    name: 'Input Text',
    category: 'Form Controls',
    icon: 'edit',
    description: 'Single-line text entry with validation and helper text support.',
    importStatement: `import { GpInputTextComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-input-text label="Name" placeholder="Jane Doe" />`,
    properties: [
      { name: 'label', type: 'string', default: "''", description: 'Label shown above the input.' },
      { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text shown when empty.' },
      { name: 'required', type: 'boolean', default: 'false', description: 'Marks the field as required.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents changes to the field.' },
      { name: 'value', type: 'string', default: "''", description: 'Current field value.' }
    ]
  },
  {
    slug: 'select',
    name: 'Select',
    category: 'Form Controls',
    icon: 'edit',
    description: 'Single or multi-choice selection with searchable options.',
    importStatement: `import { GpSelectComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-select label="Role" [options]="roles" placeholder="Select role" />`,
    properties: [
      { name: 'label', type: 'string', default: "''", description: 'Field label.' },
      { name: 'options', type: 'any[]', default: '[]', description: 'Available selectable options.' },
      { name: 'placeholder', type: 'string', default: "''", description: 'Text shown before selection.' },
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Enables multi-selection mode.' }
    ]
  },
  {
    slug: 'textarea',
    name: 'Textarea',
    category: 'Form Controls',
    icon: 'align-left',
    description: 'Multi-line text entry with resizing, counter, and validation support.',
    importStatement: `import { GpTextareaComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-textarea label="Bio" placeholder="Tell us about yourself" [autoResize]="true" />`,
    properties: [
      { name: 'label', type: 'string', default: "''", description: 'Label shown for the text area.' },
      { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text when empty.' },
      { name: 'rows', type: 'number', default: '3', description: 'Initial number of rows.' },
      { name: 'autoResize', type: 'boolean', default: 'false', description: 'Automatically grows the control as content increases.' }
    ]
  },
  {
    slug: 'password',
    name: 'Password',
    category: 'Form Controls',
    icon: 'lock',
    description: 'Password input with visibility toggling and strength guidance.',
    importStatement: `import { GpPasswordComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-password label="Password" placeholder="Choose a password" />`,
    properties: [
      { name: 'label', type: 'string', default: "''", description: 'Label shown for the password control.' },
      { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text for the field.' },
      { name: 'showToggle', type: 'boolean', default: 'true', description: 'Shows an action to reveal the password.' },
      { name: 'strength', type: 'boolean', default: 'false', description: 'Displays password strength feedback when enabled.' }
    ]
  },
  {
    slug: 'input-number',
    name: 'Input Number',
    category: 'Form Controls',
    icon: 'calculator',
    description: 'Numeric entry with min/max, step, prefix, and suffix formatting.',
    importStatement: `import { GpInputNumberComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-input-number label="Budget" prefix="$" [min]="0" [step]="50" />`,
    properties: [
      { name: 'label', type: 'string', default: "''", description: 'Field label.' },
      { name: 'value', type: 'number', default: '0', description: 'Current numeric value.' },
      { name: 'min', type: 'number', default: 'undefined', description: 'Minimum acceptable value.' },
      { name: 'max', type: 'number', default: 'undefined', description: 'Maximum acceptable value.' },
      { name: 'step', type: 'number', default: '1', description: 'Increment between values.' }
    ]
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    category: 'Form Controls',
    icon: 'check-square',
    description: 'Binary selection control for opt-ins and boolean values.',
    importStatement: `import { GpCheckboxComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-checkbox label="I agree to the terms" [checked]="true" />`,
    properties: [
      { name: 'label', type: 'string', default: "''", description: 'Text shown next to the checkbox.' },
      { name: 'checked', type: 'boolean', default: 'false', description: 'Current checked state.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction.' }
    ]
  },
  {
    slug: 'radio-button',
    name: 'Radio Button',
    category: 'Form Controls',
    icon: 'circle-dot',
    description: 'Single-choice option control within a grouped set of values.',
    importStatement: `import { GpRadioButtonComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-radio-button value="personal" label="Personal" />\n<gp-radio-button value="business" label="Business" />`,
    properties: [
      { name: 'label', type: 'string', default: "''", description: 'Visible label next to the radio input.' },
      { name: 'value', type: 'string | number | boolean', default: "''", description: 'Radio value for the group.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction.' }
    ]
  },
  {
    slug: 'switch',
    name: 'Switch',
    category: 'Form Controls',
    icon: 'toggle-on',
    description: 'Boolean toggle styled as a modern on/off switch.',
    importStatement: `import { GpSwitchComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-switch label="Push notifications" [checked]="true" />`,
    properties: [
      { name: 'label', type: 'string', default: "''", description: 'Text associated with the toggle.' },
      { name: 'checked', type: 'boolean', default: 'false', description: 'Current on/off state.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction.' }
    ]
  },
  {
    slug: 'slider',
    name: 'Slider',
    category: 'Form Controls',
    icon: 'sliders',
    description: 'Range value selector with min, max, and step support.',
    importStatement: `import { GpSliderComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-slider [min]="0" [max]="100" [step]="1" />`,
    properties: [
      { name: 'min', type: 'number', default: '0', description: 'Minimum slider value.' },
      { name: 'max', type: 'number', default: '100', description: 'Maximum slider value.' },
      { name: 'step', type: 'number', default: '1', description: 'Increment amount between values.' },
      { name: 'value', type: 'number', default: '0', description: 'Current selection.' }
    ]
  },
  {
    slug: 'rating',
    name: 'Rating',
    category: 'Form Controls',
    icon: 'star',
    description: 'Interactive star-based feedback and scoring control.',
    importStatement: `import { GpRatingComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-rating [value]="4" [max]="5" />`,
    properties: [
      { name: 'value', type: 'number', default: '0', description: 'Current rating value.' },
      { name: 'max', type: 'number', default: '5', description: 'Maximum possible rating.' },
      { name: 'readonly', type: 'boolean', default: 'false', description: 'Disables user edits.' }
    ]
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    category: 'Form Controls',
    icon: 'palette',
    description: 'Color selection control with palette and custom color input support.',
    importStatement: `import { GpColorPickerComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-color-picker label="Accent color" value="#6366f1" />`,
    properties: [
      { name: 'value', type: 'string', default: "'#000000'", description: 'Selected color value in hex format.' },
      { name: 'label', type: 'string', default: "''", description: 'Visible label for the control.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the color chooser.' }
    ]
  },
  {
    slug: 'input-mask',
    name: 'Input Mask',
    category: 'Form Controls',
    icon: 'grid',
    description: 'Text masking for phone, account, and formatted values.',
    importStatement: `import { GpInputMaskComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-input-mask label="Phone" mask="(999) 999-9999" />`,
    properties: [
      { name: 'mask', type: 'string', default: "''", description: 'Mask format applied to the input value.' },
      { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder shown before user input.' },
      { name: 'value', type: 'string', default: "''", description: 'Current masked text value.' }
    ]
  },
  {
    slug: 'multi-select',
    name: 'Multi Select',
    category: 'Form Controls',
    icon: 'list-check',
    description: 'Selection control for choosing multiple options with chips or checklists.',
    importStatement: `import { GpMultiSelectComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-multi-select [options]="skills" placeholder="Select skills" />`,
    properties: [
      { name: 'options', type: 'any[]', default: '[]', description: 'Available selectable values.' },
      { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text for the picker.' },
      { name: 'display', type: "'chip' | 'default'", default: "'default'", description: 'Selected values display mode.' }
    ]
  },
  {
    slug: 'listbox',
    name: 'Listbox',
    category: 'Form Controls',
    icon: 'list',
    description: 'List-based selection with strong support for grouped choices and keyboard navigation.',
    importStatement: `import { GpListboxComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-listbox [options]="items" optionLabel="label" />`,
    properties: [
      { name: 'options', type: 'any[]', default: '[]', description: 'Available list entries.' },
      { name: 'optionLabel', type: 'string', default: "'label'", description: 'Field used to display each item label.' },
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple selected values.' }
    ]
  },
  {
    slug: 'autocomplete',
    name: 'Autocomplete',
    category: 'Form Controls',
    icon: 'search',
    description: 'Typeahead suggestions for rapid selection and filtering.',
    importStatement: `import { GpAutoCompleteComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-autocomplete [suggestions]="cities" (completeMethod)="search($event)" />`,
    properties: [
      { name: 'suggestions', type: 'any[]', default: '[]', description: 'Matching results shown during typing.' },
      { name: 'dropdown', type: 'boolean', default: 'false', description: 'Shows a dropdown arrow button.' },
      { name: 'minLength', type: 'number', default: '1', description: 'Minimum characters before suggestions are requested.' }
    ]
  },
  {
    slug: 'cascade-select',
    name: 'Cascade Select',
    category: 'Form Controls',
    icon: 'sitemap',
    description: 'Hierarchical value selection across levels of nested options.',
    importStatement: `import { GpCascadeSelectComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-cascade-select [options]="regions" placeholder="Choose location" />`,
    properties: [
      { name: 'options', type: 'any[]', default: '[]', description: 'Nested option tree used as the selection source.' },
      { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text for the control.' },
      { name: 'showClear', type: 'boolean', default: 'true', description: 'Shows a clear button when a value is selected.' }
    ]
  },
  {
    slug: 'tree-select',
    name: 'Tree Select',
    category: 'Form Controls',
    icon: 'folder-tree',
    description: 'Selection component for hierarchical trees with expandable groups.',
    importStatement: `import { GpTreeSelectComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-tree-select [options]="departmentTree" placeholder="Select department" />`,
    properties: [
      { name: 'options', type: 'any[]', default: '[]', description: 'Nested tree data.' },
      { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text shown when empty.' },
      { name: 'filter', type: 'boolean', default: 'false', description: 'Enables filtering against the tree.' }
    ]
  },
  {
    slug: 'date-picker',
    name: 'Date Picker',
    category: 'Form Controls',
    icon: 'calendar',
    description: 'Calendar-based date selection with localization support.',
    importStatement: `import { GpDatePickerComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-date-picker placeholder="MM/DD/YYYY" />`,
    properties: [
      { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text shown when no date is selected.' },
      { name: 'showIcon', type: 'boolean', default: 'true', description: 'Shows the calendar icon trigger.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables calendar interaction.' }
    ]
  },
  {
    slug: 'time-picker',
    name: 'Time Picker',
    category: 'Form Controls',
    icon: 'clock',
    description: 'Time selection with 12h or 24h display options.',
    importStatement: `import { GpTimePickerComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-time-picker hourFormat="12" />`,
    properties: [
      { name: 'hourFormat', type: "'12' | '24'", default: "'24'", description: 'Whether hours display in 12h or 24h format.' },
      { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text for the selected time.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction.' }
    ]
  },
  {
    slug: 'file-upload',
    name: 'File Upload',
    category: 'Form Controls',
    icon: 'upload',
    description: 'Dropzone-style uploader with multi-file selection and validation.',
    importStatement: `import { GpFileUploadComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-file-upload [multiple]="true" accept="image/*" />`,
    properties: [
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Allows more than one file to be selected.' },
      { name: 'accept', type: 'string', default: "''", description: 'Accepted file type filter for the browser picker.' },
      { name: 'maxFileSize', type: 'number', default: 'undefined', description: 'Maximum allowed file size in bytes.' }
    ]
  },
  {
    slug: 'table',
    name: 'Table',
    category: 'Data Presentation',
    icon: 'bars',
    description: 'Structured table with sorting, pagination, and custom columns.',
    importStatement: `import { GpTableComponent, GpColumnComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-table [value]="rows">\n  <gp-column field="name" header="Name" />\n  <gp-column field="status" header="Status" />\n</gp-table>`,
    properties: [
      { name: 'value', type: 'any[]', default: '[]', description: 'Rows displayed in the table.' },
      { name: 'striped', type: 'boolean', default: 'false', description: 'Alternates row shading for readability.' },
      { name: 'paginator', type: 'boolean', default: 'false', description: 'Enables paginator controls.' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a loading state.' }
    ]
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    category: 'Navigation',
    icon: 'window',
    description: 'Tabbed navigation for switching between contextual views.',
    importStatement: `import { GpTabsComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-tabs [tabs]="tabs" [(value)]="selectedTab" />`,
    properties: [
      { name: 'tabs', type: 'GpTabItem[]', default: '[]', description: 'Tab definitions shown by the component.' },
      { name: 'value', type: 'string | number', default: "''", description: 'Selected tab value.' },
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Tab layout direction.' }
    ]
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    category: 'Overlays',
    icon: 'sliders',
    description: 'Modal overlays for confirmation, forms, and focused tasks.',
    importStatement: `import { GpDialogComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-dialog header="Confirm" [visible]="visible" [modal]="true">\n  Are you sure?\n</gp-dialog>`,
    properties: [
      { name: 'header', type: 'string', default: "''", description: 'Dialog title text.' },
      { name: 'visible', type: 'boolean', default: 'false', description: 'Controls dialog visibility.' },
      { name: 'modal', type: 'boolean', default: 'true', description: 'Whether the dialog should trap focus and mask the background.' },
      { name: 'closable', type: 'boolean', default: 'true', description: 'Whether the close button is shown.' }
    ]
  },
  {
    slug: 'card',
    name: 'Card',
    category: 'Panels',
    icon: 'layer-group',
    description: 'Content containers with optional header, body, and footer areas.',
    importStatement: `import { GpCardComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-card header="Project Summary">\n  <p>Overview and metrics</p>\n</gp-card>`,
    properties: [
      { name: 'header', type: 'string', default: "''", description: 'Title displayed in the header region.' },
      { name: 'subheader', type: 'string', default: "''", description: 'Secondary subtitle content.' },
      { name: 'shadow', type: 'boolean', default: 'true', description: 'Applies a card shadow style.' }
    ]
  },
  {
    slug: 'message',
    name: 'Message',
    category: 'Feedback',
    icon: 'info-circle',
    description: 'Inline status notifications tied to user or system state.',
    importStatement: `import { GpMessageComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-message severity="success" text="Saved successfully" />`,
    properties: [
      { name: 'severity', type: "'success' | 'info' | 'warn' | 'error'", default: "'info'", description: 'Message severity level.' },
      { name: 'text', type: 'string', default: "''", description: 'Message text content.' },
      { name: 'closable', type: 'boolean', default: 'false', description: 'Allows the message to be dismissed.' }
    ]
  },
  {
    slug: 'icon',
    name: 'Icon',
    category: 'Display',
    icon: 'star',
    description: 'SVG icon component backed by the gp-icons registry for consistent utility and action visuals.',
    importStatement: `import { GpIconComponent } from 'gp-ui-icons';`,
    exampleCode: `<gp-icon name="search" size="1.5em" />\n<gp-icon name="check-circle" size="1.5em" color="var(--gp-success)" />`,
    properties: [
      { name: 'name', type: 'string', default: "''", description: 'Icon key looked up in the gp-icons registry.' },
      { name: 'size', type: 'string | number', default: "'1em'", description: 'Icon width and height size.' },
      { name: 'color', type: 'string', default: "''", description: 'Custom CSS color applied to the SVG.' },
      { name: 'spin', type: 'boolean', default: 'false', description: 'Applies a rotating spinner animation.' },
      { name: 'rotate', type: 'number', default: '0', description: 'Rotation in degrees for the icon.' },
      { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible label announced by screen readers.' }
    ]
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    category: 'Display',
    icon: 'star',
    description: 'User profile visuals with image or initials-based fallback.',
    importStatement: `import { GpAvatarComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-avatar image="/img/profile.png" size="md" />`,
    properties: [
      { name: 'image', type: 'string', default: "''", description: 'Image URL for the avatar.' },
      { name: 'label', type: 'string', default: "''", description: 'Alternative text or initials fallback.' },
      { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Avatar profile size.' }
    ]
  },
  {
    slug: 'badge',
    name: 'Badge',
    category: 'Feedback',
    icon: 'info-circle',
    description: 'Compact status indicators for counts, states, and labels.',
    importStatement: `import { GpBadgeComponent } from '@generatedpixel/gp-ui';`,
    exampleCode: `<gp-badge value="New" severity="primary" />`,
    properties: [
      { name: 'value', type: 'string | number', default: "''", description: 'Badge content.' },
      { name: 'severity', type: "'primary' | 'success' | 'warning' | 'danger' | 'secondary'", default: "'primary'", description: 'Badge color scheme.' }
    ]
  }
];

export function getComponentDoc(slug: string): ComponentDocDefinition | undefined {
  const doc = componentDocs.find(item => item.slug === slug);
  return doc ? withInheritedApi(doc) : undefined;
}
