import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GpButtonComponent,
  GpButtonGroupComponent,
  GpToggleButtonComponent,
  GpInputTextComponent,
  GpTextareaComponent,
  GpPasswordComponent,
  GpInputNumberComponent,
  GpCheckboxComponent,
  GpRadioButtonComponent,
  GpSwitchComponent,
  GpSliderComponent,
  GpRatingComponent,
  GpSelectComponent,
  GpBadgeComponent,
  GpTagComponent,
  GpProgressBarComponent,
  GpProgressSpinnerComponent,
  GpSkeletonComponent,
  GpMessageComponent,
  GpAvatarComponent,
  GpChipComponent,
  GpBreadcrumbComponent,
  GpTabsComponent,
  GpTabPanelComponent,
  GpCardComponent,
  GpPanelComponent,
  GpDividerComponent,
  GpAccordionComponent,
  GpAccordionTabComponent,
  GpTableComponent,
  GpColumnComponent
} from 'gp-ui';
import {
  GpThemeManager,
  GpThemeDefinition,
  GpColorScale,
  builtInThemes,
  defaultTheme,
  generateColorScale,
  themeToCss,
  themeToTypeScript,
  themeToJson,
  themeToAngularSetup,
  deepMerge
} from 'gp-ui-theme';
import { GpIconComponent } from 'gp-ui-icons';
import { DocCodeComponent } from '../../shared/doc-code.component';

@Component({
  selector: 'app-theme-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GpButtonComponent,
    GpButtonGroupComponent,
    GpToggleButtonComponent,
    GpInputTextComponent,
    GpTextareaComponent,
    GpPasswordComponent,
    GpInputNumberComponent,
    GpCheckboxComponent,
    GpRadioButtonComponent,
    GpSwitchComponent,
    GpSliderComponent,
    GpRatingComponent,
    GpSelectComponent,
    GpBadgeComponent,
    GpTagComponent,
    GpProgressBarComponent,
    GpProgressSpinnerComponent,
    GpSkeletonComponent,
    GpMessageComponent,
    GpAvatarComponent,
    GpChipComponent,
    GpBreadcrumbComponent,
    GpTabsComponent,
    GpTabPanelComponent,
    GpCardComponent,
    GpPanelComponent,
    GpDividerComponent,
    GpAccordionComponent,
    GpAccordionTabComponent,
    GpTableComponent,
    GpColumnComponent,
    GpIconComponent,
    DocCodeComponent
  ],
  template: `
    <div class="theme-editor-wrapper">
      <!-- Editor Header & Toolbar -->
      <div class="editor-header">
        <div class="header-left">
          <div class="theme-title-input">
            <gp-icon name="palette" size="1.2em" />
            <input
              type="text"
              class="theme-name-field"
              [value]="themeName()"
              (input)="onThemeNameChange($event)"
              placeholder="Theme Name (e.g. My Brand Theme)"
            />
            <span class="theme-id-tag">ID: {{ themeId() }}</span>
          </div>
        </div>

        <div class="header-right">
          <!-- Preset Selector -->
          <div class="preset-dropdown-wrap">
            <span class="toolbar-label">Preset:</span>
            <select class="editor-select" (change)="onPresetSelect($event)">
              @for (preset of builtInPresets; track preset.id) {
                <option [value]="preset.id" [selected]="selectedPresetId() === preset.id">
                  {{ preset.name }}
                </option>
              }
            </select>
          </div>

          <!-- Edit Mode Toggle (Light / Dark) -->
          <div class="mode-switch-wrap">
            <button
              type="button"
              class="mode-btn"
              [class.active]="editMode() === 'light'"
              (click)="setEditMode('light')"
            >
              <gp-icon name="sun" size="0.9em" />
              <span>Light Mode</span>
            </button>
            <button
              type="button"
              class="mode-btn"
              [class.active]="editMode() === 'dark'"
              (click)="setEditMode('dark')"
            >
              <gp-icon name="moon" size="0.9em" />
              <span>Dark Mode</span>
            </button>
          </div>

          <!-- Reset & Export Buttons -->
          <gp-button
            label="Reset"
            variant="outlined"
            severity="secondary"
            size="sm"
            (onClickEvent)="resetToPreset()"
          />
          <gp-button
            label="Export Theme"
            variant="filled"
            severity="primary"
            size="sm"
            (onClickEvent)="setActiveTab('export')"
          />
        </div>
      </div>

      <!-- Editor Main Container: Left Control Tabs & Right Live Sandbox -->
      <div class="editor-body">
        <!-- Control Panel Side -->
        <div class="control-panel">
          <!-- Main Tab Navigation Bar -->
          <div class="editor-tabs">
            <button
              type="button"
              class="tab-btn"
              [class.active]="activeTab() === 'primitives'"
              (click)="setActiveTab('primitives')"
            >
              <gp-icon name="sliders" size="0.9em" />
              <span>Primitives</span>
            </button>
            <button
              type="button"
              class="tab-btn"
              [class.active]="activeTab() === 'semantics'"
              (click)="setActiveTab('semantics')"
            >
              <gp-icon name="palette" size="0.9em" />
              <span>Semantics</span>
            </button>
            <button
              type="button"
              class="tab-btn"
              [class.active]="activeTab() === 'components'"
              (click)="setActiveTab('components')"
            >
              <gp-icon name="box" size="0.9em" />
              <span>Components</span>
            </button>
            <button
              type="button"
              class="tab-btn"
              [class.active]="activeTab() === 'export'"
              (click)="setActiveTab('export')"
            >
              <gp-icon name="download" size="0.9em" />
              <span>Export Code</span>
            </button>
          </div>

          <div class="tab-content">
            <!-- 1. PRIMITIVES TAB -->
            @if (activeTab() === 'primitives') {
              <div class="tab-section">
                <h3>Primary Color Scale Generator</h3>
                <p class="section-desc">
                  Pick a base brand color (Step 500) to automatically generate an HSL-calculated 50–950 shade ramp.
                </p>

                <div class="color-picker-row">
                  <label>Base Primary Color (500):</label>
                  <div class="picker-controls">
                    <input
                      type="color"
                      [value]="primaryBaseColor()"
                      (change)="onPrimaryHexChange($event)"
                      class="native-color-picker"
                    />
                    <input
                      type="text"
                      [value]="primaryBaseColor()"
                      (change)="onPrimaryHexChange($event)"
                      class="editor-input hex-input"
                    />
                  </div>
                </div>

                <!-- Swatch Scale Ramp Display -->
                <div class="shade-ramp-grid">
                  @for (step of colorScaleSteps; track step) {
                    <div class="shade-box">
                      <div
                        class="shade-swatch"
                        [style.backgroundColor]="getPrimaryScaleStep(step)"
                        [title]="'Step ' + step + ': ' + getPrimaryScaleStep(step)"
                      ></div>
                      <span class="shade-step">{{ step }}</span>
                      <span class="shade-hex">{{ getPrimaryScaleStep(step) }}</span>
                    </div>
                  }
                </div>

                <hr class="section-divider" />

                <h3>Border Radius Scale</h3>
                <p class="section-desc">Adjust global corner rounding across all components.</p>
                <div class="form-grid">
                  <div class="form-group">
                    <label>Small (sm):</label>
                    <input
                      type="text"
                      class="editor-input"
                      [value]="currentTheme().primitives.borderRadius.sm"
                      (change)="updateRadius('sm', $event)"
                    />
                  </div>
                  <div class="form-group">
                    <label>Base (base):</label>
                    <input
                      type="text"
                      class="editor-input"
                      [value]="currentTheme().primitives.borderRadius.base"
                      (change)="updateRadius('base', $event)"
                    />
                  </div>
                  <div class="form-group">
                    <label>Medium (md):</label>
                    <input
                      type="text"
                      class="editor-input"
                      [value]="currentTheme().primitives.borderRadius.md"
                      (change)="updateRadius('md', $event)"
                    />
                  </div>
                  <div class="form-group">
                    <label>Large (lg):</label>
                    <input
                      type="text"
                      class="editor-input"
                      [value]="currentTheme().primitives.borderRadius.lg"
                      (change)="updateRadius('lg', $event)"
                    />
                  </div>
                </div>

                <hr class="section-divider" />

                <h3>Typography Primitives</h3>
                <div class="form-grid">
                  <div class="form-group full-width">
                    <label>Sans-Serif Font Family:</label>
                    <input
                      type="text"
                      class="editor-input"
                      [value]="currentTheme().primitives.typography.fontFamily.sans"
                      (change)="updateFont('sans', $event)"
                    />
                  </div>
                  <div class="form-group">
                    <label>Base Font Size:</label>
                    <input
                      type="text"
                      class="editor-input"
                      [value]="currentTheme().primitives.typography.fontSize.base"
                      (change)="updateFontSize('base', $event)"
                    />
                  </div>
                </div>
              </div>
            }

            <!-- 2. SEMANTICS TAB -->
            @if (activeTab() === 'semantics') {
              <div class="tab-section">
                <h3>Semantic Tokens ({{ editMode() | titlecase }} Mode)</h3>
                <p class="section-desc">Customize brand intents, status colors, surfaces, and text for {{ editMode() }} mode.</p>

                <h4>Brand &amp; Status Colors</h4>
                <div class="token-grid">
                  <!-- Primary -->
                  <div class="token-card">
                    <span class="token-title">Primary Main</span>
                    <div class="picker-controls">
                      <input
                        type="color"
                        [value]="activeSemantic().primary.main"
                        (change)="updateSemantic('primary', 'main', $event)"
                        class="native-color-picker"
                      />
                      <input
                        type="text"
                        class="editor-input hex-input"
                        [value]="activeSemantic().primary.main"
                        (change)="updateSemantic('primary', 'main', $event)"
                      />
                    </div>
                  </div>

                  <!-- Secondary -->
                  <div class="token-card">
                    <span class="token-title">Secondary Main</span>
                    <div class="picker-controls">
                      <input
                        type="color"
                        [value]="activeSemantic().secondary.main"
                        (change)="updateSemantic('secondary', 'main', $event)"
                        class="native-color-picker"
                      />
                      <input
                        type="text"
                        class="editor-input hex-input"
                        [value]="activeSemantic().secondary.main"
                        (change)="updateSemantic('secondary', 'main', $event)"
                      />
                    </div>
                  </div>

                  <!-- Success -->
                  <div class="token-card">
                    <span class="token-title">Success</span>
                    <div class="picker-controls">
                      <input
                        type="color"
                        [value]="activeSemantic().success.main"
                        (change)="updateSemantic('success', 'main', $event)"
                        class="native-color-picker"
                      />
                      <input
                        type="text"
                        class="editor-input hex-input"
                        [value]="activeSemantic().success.main"
                        (change)="updateSemantic('success', 'main', $event)"
                      />
                    </div>
                  </div>

                  <!-- Danger -->
                  <div class="token-card">
                    <span class="token-title">Danger</span>
                    <div class="picker-controls">
                      <input
                        type="color"
                        [value]="activeSemantic().danger.main"
                        (change)="updateSemantic('danger', 'main', $event)"
                        class="native-color-picker"
                      />
                      <input
                        type="text"
                        class="editor-input hex-input"
                        [value]="activeSemantic().danger.main"
                        (change)="updateSemantic('danger', 'main', $event)"
                      />
                    </div>
                  </div>
                </div>

                <hr class="section-divider" />

                <h4>Surfaces &amp; Text Colors</h4>
                <div class="token-grid">
                  <div class="token-card">
                    <span class="token-title">Surface Ground</span>
                    <div class="picker-controls">
                      <input
                        type="color"
                        [value]="activeSemantic().surfaces.ground"
                        (change)="updateSurface('ground', $event)"
                        class="native-color-picker"
                      />
                      <input
                        type="text"
                        class="editor-input hex-input"
                        [value]="activeSemantic().surfaces.ground"
                        (change)="updateSurface('ground', $event)"
                      />
                    </div>
                  </div>

                  <div class="token-card">
                    <span class="token-title">Surface Card</span>
                    <div class="picker-controls">
                      <input
                        type="color"
                        [value]="activeSemantic().surfaces.card"
                        (change)="updateSurface('card', $event)"
                        class="native-color-picker"
                      />
                      <input
                        type="text"
                        class="editor-input hex-input"
                        [value]="activeSemantic().surfaces.card"
                        (change)="updateSurface('card', $event)"
                      />
                    </div>
                  </div>

                  <div class="token-card">
                    <span class="token-title">Surface Border</span>
                    <div class="picker-controls">
                      <input
                        type="color"
                        [value]="activeSemantic().surfaces.border"
                        (change)="updateSurface('border', $event)"
                        class="native-color-picker"
                      />
                      <input
                        type="text"
                        class="editor-input hex-input"
                        [value]="activeSemantic().surfaces.border"
                        (change)="updateSurface('border', $event)"
                      />
                    </div>
                  </div>

                  <div class="token-card">
                    <span class="token-title">Text Primary</span>
                    <div class="picker-controls">
                      <input
                        type="color"
                        [value]="activeSemantic().text.primary"
                        (change)="updateTextToken('primary', $event)"
                        class="native-color-picker"
                      />
                      <input
                        type="text"
                        class="editor-input hex-input"
                        [value]="activeSemantic().text.primary"
                        (change)="updateTextToken('primary', $event)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- 3. COMPONENTS TAB (ALL GP-UI COMPONENTS) -->
            @if (activeTab() === 'components') {
              <div class="tab-section">
                <h3>Component Token Overrides</h3>
                <p class="section-desc">Select any component from the library to override its specific design tokens.</p>

                <div class="comp-select-row">
                  <label>Component Target:</label>
                  <select class="editor-select" [ngModel]="selectedComponent()" (ngModelChange)="selectedComponent.set($event)">
                    <optgroup label="Buttons">
                      <option value="button">Button</option>
                      <option value="buttonGroup">Button Group</option>
                      <option value="splitButton">Split Button</option>
                      <option value="speedDial">Speed Dial</option>
                      <option value="toggleButton">Toggle Button</option>
                    </optgroup>
                    <optgroup label="Form Controls">
                      <option value="input">Input / Input Text</option>
                      <option value="textarea">Textarea</option>
                      <option value="password">Password</option>
                      <option value="inputNumber">Input Number</option>
                      <option value="inputMask">Input Mask</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="radioButton">Radio Button</option>
                      <option value="switch">Switch</option>
                      <option value="slider">Slider</option>
                      <option value="rating">Rating</option>
                      <option value="colorPicker">Color Picker</option>
                      <option value="select">Select</option>
                      <option value="multiSelect">MultiSelect</option>
                      <option value="listbox">Listbox</option>
                      <option value="autocomplete">Autocomplete</option>
                      <option value="cascadeSelect">Cascade Select</option>
                      <option value="treeSelect">Tree Select</option>
                      <option value="datePicker">Date Picker</option>
                      <option value="timePicker">Time Picker</option>
                      <option value="fileUpload">File Upload</option>
                    </optgroup>
                    <optgroup label="Data & Grid">
                      <option value="table">Table</option>
                      <option value="column">Column</option>
                      <option value="treeTable">Tree Table</option>
                      <option value="dataView">Data View</option>
                      <option value="paginator">Paginator</option>
                      <option value="virtualScroller">Virtual Scroller</option>
                    </optgroup>
                    <optgroup label="Display">
                      <option value="avatar">Avatar</option>
                      <option value="chip">Chip</option>
                      <option value="badge">Badge</option>
                      <option value="tag">Tag</option>
                      <option value="image">Image</option>
                      <option value="carousel">Carousel</option>
                      <option value="timeline">Timeline</option>
                      <option value="meterGroup">Meter Group</option>
                      <option value="emptyState">Empty State</option>
                    </optgroup>
                    <optgroup label="Feedback">
                      <option value="toast">Toast</option>
                      <option value="message">Message</option>
                      <option value="progressBar">Progress Bar</option>
                      <option value="progressSpinner">Progress Spinner</option>
                      <option value="skeleton">Skeleton</option>
                    </optgroup>
                    <optgroup label="Navigation">
                      <option value="menu">Menu</option>
                      <option value="menubar">Menubar</option>
                      <option value="contextMenu">Context Menu</option>
                      <option value="tieredMenu">Tiered Menu</option>
                      <option value="megaMenu">Mega Menu</option>
                      <option value="panelMenu">Panel Menu</option>
                      <option value="breadcrumb">Breadcrumb</option>
                      <option value="tabs">Tabs</option>
                      <option value="stepper">Stepper</option>
                      <option value="dock">Dock</option>
                      <option value="toolbar">Toolbar</option>
                    </optgroup>
                    <optgroup label="Overlay">
                      <option value="dialog">Dialog</option>
                      <option value="confirmDialog">Confirm Dialog</option>
                      <option value="drawer">Drawer</option>
                      <option value="popover">Popover</option>
                    </optgroup>
                    <optgroup label="Panels">
                      <option value="card">Card</option>
                      <option value="panel">Panel</option>
                      <option value="accordion">Accordion</option>
                      <option value="fieldset">Fieldset</option>
                      <option value="divider">Divider</option>
                      <option value="splitter">Splitter</option>
                      <option value="scrollPanel">Scroll Panel</option>
                    </optgroup>
                    <optgroup label="Tree & Hierarchy">
                      <option value="tree">Tree</option>
                      <option value="treeNode">Tree Node</option>
                      <option value="orgChart">Org Chart</option>
                    </optgroup>
                  </select>
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label>Background Override:</label>
                    <input
                      type="text"
                      class="editor-input"
                      [value]="getCompToken(selectedComponent(), 'background')"
                      (change)="updateCompToken(selectedComponent(), 'background', $event)"
                      placeholder="{semantic.surfaces.card}"
                    />
                  </div>
                  <div class="form-group">
                    <label>Text Color Override:</label>
                    <input
                      type="text"
                      class="editor-input"
                      [value]="getCompToken(selectedComponent(), 'color')"
                      (change)="updateCompToken(selectedComponent(), 'color', $event)"
                      placeholder="{semantic.text.primary}"
                    />
                  </div>
                  <div class="form-group">
                    <label>Border Radius Override:</label>
                    <input
                      type="text"
                      class="editor-input"
                      [value]="getCompToken(selectedComponent(), 'borderRadius')"
                      (change)="updateCompToken(selectedComponent(), 'borderRadius', $event)"
                      placeholder="{primitives.borderRadius.base}"
                    />
                  </div>
                  <div class="form-group">
                    <label>Padding Override:</label>
                    <input
                      type="text"
                      class="editor-input"
                      [value]="getCompToken(selectedComponent(), 'padding')"
                      (change)="updateCompToken(selectedComponent(), 'padding', $event)"
                      placeholder="{primitives.spacing.4}"
                    />
                  </div>
                </div>
              </div>
            }

            <!-- 4. EXPORT TAB -->
            @if (activeTab() === 'export') {
              <div class="tab-section export-section">
                <h3>Export Theme Package</h3>
                <p class="section-desc">Copy or download your customized theme output for direct integration into Angular apps.</p>

                <div class="export-format-selector">
                  <button
                    type="button"
                    class="format-btn"
                    [class.active]="exportFormat() === 'css'"
                    (click)="exportFormat.set('css')"
                  >
                    CSS Stylesheet (.css)
                  </button>
                  <button
                    type="button"
                    class="format-btn"
                    [class.active]="exportFormat() === 'typescript'"
                    (click)="exportFormat.set('typescript')"
                  >
                    TypeScript Definition (.ts)
                  </button>
                  <button
                    type="button"
                    class="format-btn"
                    [class.active]="exportFormat() === 'json'"
                    (click)="exportFormat.set('json')"
                  >
                    JSON Tokens (.json)
                  </button>
                  <button
                    type="button"
                    class="format-btn"
                    [class.active]="exportFormat() === 'angular'"
                    (click)="exportFormat.set('angular')"
                  >
                    Angular Integration
                  </button>
                </div>

                <div class="export-actions-bar">
                  <gp-button
                    [label]="copied() ? 'Copied to Clipboard!' : 'Copy Code'"
                    [icon]="copied() ? 'check' : 'copy'"
                    [severity]="copied() ? 'success' : 'primary'"
                    size="sm"
                    (onClickEvent)="copyToClipboard()"
                  />
                  <gp-button
                    label="Download Theme File"
                    icon="download"
                    variant="outlined"
                    severity="secondary"
                    size="sm"
                    (onClickEvent)="downloadExportFile()"
                  />
                </div>

                <doc-code [code]="currentExportCode()" [language]="exportLanguage()" />
              </div>
            }
          </div>
        </div>

        <!-- Right Side: Comprehensive Live Component Sandbox -->
        <div class="preview-panel">
          <div class="preview-header">
            <div class="preview-title">
              <gp-icon name="eye" size="1.1em" />
              <h3>Live Component Sandbox</h3>
            </div>
            <div class="preview-badges">
              <gp-tag [value]="'Theme: ' + themeName()" severity="primary" />
              <gp-tag [value]="'Mode: ' + editMode()" severity="success" />
            </div>
          </div>

          <div class="sandbox-container">
            <!-- Buttons & Action Controls -->
            <div class="sandbox-group">
              <h4 class="group-title">Buttons &amp; Actions</h4>
              <div class="component-row">
                <gp-button label="Primary" severity="primary" />
                <gp-button label="Secondary" severity="secondary" />
                <gp-button label="Success" severity="success" />
                <gp-button label="Danger" severity="danger" />
                <gp-button label="Outlined" variant="outlined" severity="primary" />
                <gp-button label="Text" variant="text" severity="primary" />
                <gp-toggle-button [(ngModel)]="toggleState" onLabel="Active" offLabel="Inactive" />
              </div>
              <div class="component-row">
                <gp-button-group>
                  <gp-button label="Left Option" severity="secondary" />
                  <gp-button label="Right Option" severity="secondary" />
                </gp-button-group>
              </div>
            </div>

            <!-- Form Inputs & Selectors -->
            <div class="sandbox-group">
              <h4 class="group-title">Form Controls &amp; Inputs</h4>
              <div class="component-row grid-2">
                <gp-input-text placeholder="Text Input..." />
                <gp-password placeholder="Password..." />
              </div>
              <div class="component-row grid-2">
                <gp-input-number [value]="42" placeholder="Number..." />
                <gp-select [options]="sampleOptions" placeholder="Select Option" />
              </div>
              <div class="component-row full-width">
                <gp-textarea placeholder="Textarea multi-line input..." [rows]="2" />
              </div>
              <div class="component-row align-center">
                <gp-checkbox [(ngModel)]="checkboxState" label="Remember choice" />
                <gp-radio-button name="radioGroup" value="A" [(ngModel)]="radioState" label="Option A" />
                <gp-radio-button name="radioGroup" value="B" [(ngModel)]="radioState" label="Option B" />
                <gp-switch [(ngModel)]="previewSwitch" />
              </div>
              <div class="component-row">
                <gp-slider [(ngModel)]="previewSliderValue" [min]="0" [max]="100" />
                <gp-rating [(ngModel)]="ratingValue" />
              </div>
            </div>

            <!-- Data & Displays (Avatars, Chips, Tags, Badges) -->
            <div class="sandbox-group">
              <h4 class="group-title">Display &amp; Badges</h4>
              <div class="component-row">
                <gp-avatar label="JD" shape="circle" size="normal" />
                <gp-avatar label="GP" shape="square" size="large" />
                <gp-chip label="Design System" icon="tag" />
                <gp-tag value="Active" severity="success" [rounded]="true" />
                <gp-tag value="Pending" severity="warning" [rounded]="true" />
                <gp-badge value="99+" severity="danger" />
              </div>
            </div>

            <!-- Data Table Preview -->
            <div class="sandbox-group">
              <h4 class="group-title">Data Table</h4>
              <gp-table [value]="tableData">
                <gp-column field="name" header="Name" />
                <gp-column field="role" header="Role" />
                <gp-column field="status" header="Status" />
              </gp-table>
            </div>

            <!-- Feedback & Indicators -->
            <div class="sandbox-group">
              <h4 class="group-title">Feedback &amp; Progress</h4>
              <gp-message severity="info" text="This is a live semantic message alert banner." />
              <gp-progress-bar [value]="previewSliderValue" />
              <div class="component-row">
                <gp-progress-spinner size="30px" />
                <gp-skeleton width="120px" height="24px" />
              </div>
            </div>

            <!-- Navigation & Breadcrumb -->
            <div class="sandbox-group">
              <h4 class="group-title">Navigation &amp; Tabs</h4>
              <gp-breadcrumb [model]="breadcrumbItems" />
              <gp-tabs>
                <gp-tab-panel header="Overview">
                  <p style="padding: 0.5rem 0; font-size: 0.85rem;">Interactive tab content 1</p>
                </gp-tab-panel>
                <gp-tab-panel header="Settings">
                  <p style="padding: 0.5rem 0; font-size: 0.85rem;">Interactive tab content 2</p>
                </gp-tab-panel>
              </gp-tabs>
            </div>

            <!-- Card & Panel Surface Containers -->
            <div class="sandbox-group">
              <h4 class="group-title">Surfaces &amp; Containers</h4>
              <gp-card header="Sample Card Container" subheader="Live Surface Subtitle">
                <p class="card-body">
                  Card container rendered with live surface tokens, border radius, typography, and dividers.
                </p>
                <gp-divider />
                <div class="card-footer">
                  <gp-button label="Card Action" size="sm" severity="primary" />
                </div>
              </gp-card>

              <gp-panel header="Sample Panel Container">
                <p style="font-size: 0.85rem; padding: 0.25rem 0;">
                  Panel container rendered with theme border and background tokens.
                </p>
              </gp-panel>

              <gp-accordion>
                <gp-accordion-tab header="Accordion Section Preview">
                  <p style="font-size: 0.85rem; padding: 0.4rem 0;">
                    Accordion panel with theme typography and surface styling.
                  </p>
                </gp-accordion-tab>
              </gp-accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .theme-editor-wrapper {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        background: var(--gp-surface-card, #ffffff);
        border: 1px solid var(--gp-surface-border, rgba(0, 0, 0, 0.1));
        border-radius: var(--gp-border-radius-lg, 0.75rem);
        padding: 1.25rem;
        box-shadow: var(--gp-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
      }

      .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--gp-surface-border, rgba(0, 0, 0, 0.1));
      }

      .theme-title-input {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .theme-name-field {
        font-size: 1.1rem;
        font-weight: 600;
        background: transparent;
        border: 1px solid transparent;
        border-bottom: 1px dashed var(--gp-primary, #4f46e5);
        color: var(--gp-text-color, #1e293b);
        padding: 0.25rem 0.5rem;
        outline: none;
      }

      .theme-name-field:focus {
        border-bottom-style: solid;
      }

      .theme-id-tag {
        font-size: 0.8rem;
        font-family: monospace;
        color: var(--gp-text-color-muted, #64748b);
        background: var(--gp-surface-section, #f8fafc);
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .preset-dropdown-wrap {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.875rem;
      }

      .editor-select {
        background: var(--gp-surface-ground, #ffffff);
        color: var(--gp-text-color, #1e293b);
        border: 1px solid var(--gp-surface-border, rgba(0, 0, 0, 0.15));
        border-radius: 0.375rem;
        padding: 0.35rem 0.6rem;
        font-size: 0.875rem;
        outline: none;
      }

      .mode-switch-wrap {
        display: flex;
        background: var(--gp-surface-section, #f1f5f9);
        padding: 0.2rem;
        border-radius: 0.5rem;
        gap: 0.2rem;
      }

      .mode-btn {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        border: none;
        background: transparent;
        color: var(--gp-text-color-muted, #64748b);
        padding: 0.3rem 0.6rem;
        font-size: 0.8rem;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .mode-btn.active {
        background: var(--gp-surface-card, #ffffff);
        color: var(--gp-primary, #4f46e5);
        font-weight: 600;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .editor-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }

      @media (max-width: 1024px) {
        .editor-body {
          grid-template-columns: 1fr;
        }
      }

      .control-panel {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .editor-tabs {
        display: flex;
        gap: 0.5rem;
        border-bottom: 1px solid var(--gp-surface-border, rgba(0, 0, 0, 0.1));
        padding-bottom: 0.5rem;
      }

      .tab-btn {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        border: none;
        background: transparent;
        color: var(--gp-text-color-secondary, #475569);
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        font-weight: 500;
        border-radius: 0.375rem;
        cursor: pointer;
      }

      .tab-btn.active {
        background: var(--gp-primary-light, #eef2ff);
        color: var(--gp-primary, #4f46e5);
        font-weight: 600;
      }

      .tab-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .section-desc {
        font-size: 0.85rem;
        color: var(--gp-text-color-muted, #64748b);
        margin: 0;
      }

      .section-divider {
        border: none;
        border-top: 1px solid var(--gp-surface-border, rgba(0, 0, 0, 0.1));
        margin: 0.5rem 0;
      }

      .color-picker-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .picker-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .native-color-picker {
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        padding: 0;
        background: none;
      }

      .editor-input {
        background: var(--gp-surface-ground, #ffffff);
        color: var(--gp-text-color, #1e293b);
        border: 1px solid var(--gp-surface-border, rgba(0, 0, 0, 0.15));
        border-radius: 0.375rem;
        padding: 0.35rem 0.6rem;
        font-size: 0.875rem;
        outline: none;
      }

      .hex-input {
        width: 90px;
        font-family: monospace;
        text-transform: uppercase;
      }

      .shade-ramp-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(65px, 1fr));
        gap: 0.4rem;
        margin-top: 0.5rem;
      }

      .shade-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.2rem;
      }

      .shade-swatch {
        width: 100%;
        height: 36px;
        border-radius: 0.375rem;
        border: 1px solid rgba(0, 0, 0, 0.1);
      }

      .shade-step {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--gp-text-color, #1e293b);
      }

      .shade-hex {
        font-size: 0.65rem;
        font-family: monospace;
        color: var(--gp-text-color-muted, #64748b);
      }

      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        font-size: 0.85rem;
      }

      .form-group.full-width {
        grid-column: 1 / -1;
      }

      .token-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 0.75rem;
      }

      .token-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0.75rem;
        background: var(--gp-surface-section, #f8fafc);
        border: 1px solid var(--gp-surface-border, rgba(0, 0, 0, 0.08));
        border-radius: 0.5rem;
      }

      .token-title {
        font-size: 0.8rem;
        font-weight: 500;
      }

      .export-format-selector {
        display: flex;
        gap: 0.4rem;
        flex-wrap: wrap;
      }

      .format-btn {
        border: 1px solid var(--gp-surface-border, rgba(0, 0, 0, 0.15));
        background: var(--gp-surface-ground, #ffffff);
        color: var(--gp-text-color, #1e293b);
        padding: 0.4rem 0.75rem;
        font-size: 0.8rem;
        border-radius: 0.375rem;
        cursor: pointer;
      }

      .format-btn.active {
        background: var(--gp-primary, #4f46e5);
        color: #ffffff;
        border-color: var(--gp-primary, #4f46e5);
      }

      .export-actions-bar {
        display: flex;
        gap: 0.5rem;
      }

      /* Preview Panel */
      .preview-panel {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background: var(--gp-surface-ground, #f8fafc);
        border: 1px solid var(--gp-surface-border, rgba(0, 0, 0, 0.1));
        border-radius: 0.75rem;
        padding: 1.25rem;
      }

      .preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .preview-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .preview-title h3 {
        margin: 0;
        font-size: 1.1rem;
      }

      .preview-badges {
        display: flex;
        gap: 0.4rem;
      }

      .sandbox-container {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .sandbox-group {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }

      .group-title {
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--gp-text-color-muted, #64748b);
        margin: 0;
      }

      .component-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100%;
      }

      .full-width {
        width: 100%;
      }

      .align-center {
        align-items: center;
      }

      .card-body {
        margin: 0;
        font-size: 0.875rem;
        color: var(--gp-text-color-secondary, #475569);
      }

      .card-footer {
        display: flex;
        gap: 0.5rem;
      }
    `
  ]
})
export class ThemeEditorComponent {
  public builtInPresets = builtInThemes;
  public selectedPresetId = signal<string>('default');

  public themeName = signal<string>('My Custom Theme');
  public themeId = computed(() =>
    this.themeName()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
  );

  public editMode = signal<'light' | 'dark'>('light');
  public activeTab = signal<'primitives' | 'semantics' | 'components' | 'export'>('primitives');
  public exportFormat = signal<'css' | 'typescript' | 'json' | 'angular'>('css');

  public copied = signal<boolean>(false);
  public previewSwitch = true;
  public previewSliderValue = 65;
  public toggleState = true;
  public checkboxState = true;
  public radioState = 'A';
  public ratingValue = 4;

  public sampleOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' }
  ];

  public breadcrumbItems = [
    { label: 'Home', url: '/' },
    { label: 'Components', url: '/components' },
    { label: 'Theme Editor' }
  ];

  public tableData = [
    { name: 'Alex Smith', role: 'Lead Architect', status: 'Active' },
    { name: 'Maria Garcia', role: 'UI Engineer', status: 'In Review' }
  ];

  public colorScaleSteps: (keyof GpColorScale)[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  public selectedComponent = signal<string>('button');

  // Working state theme definition
  public currentTheme = signal<GpThemeDefinition>(deepMerge(defaultTheme, { id: 'my-custom-theme', name: 'My Custom Theme' }));

  public primaryBaseColor = computed(() => this.currentTheme().light.semantic.primary.main || '#4f46e5');

  public activeSemantic = computed(() =>
    this.editMode() === 'dark' ? this.currentTheme().dark.semantic : this.currentTheme().light.semantic
  );

  constructor() {
    // Automatically re-inject theme CSS whenever working theme changes
    effect(() => {
      const theme = this.currentTheme();
      const updatedTheme: GpThemeDefinition = {
        ...theme,
        id: this.themeId(),
        name: this.themeName()
      };
      GpThemeManager.registerTheme(updatedTheme);
      GpThemeManager.setTheme(updatedTheme);
    });
  }

  public onThemeNameChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.themeName.set(val || 'Custom Theme');
  }

  public setEditMode(mode: 'light' | 'dark'): void {
    this.editMode.set(mode);
    GpThemeManager.setMode(mode);
  }

  public setActiveTab(tab: 'primitives' | 'semantics' | 'components' | 'export'): void {
    this.activeTab.set(tab);
  }

  public onPresetSelect(event: Event): void {
    const presetId = (event.target as HTMLSelectElement).value;
    this.selectedPresetId.set(presetId);
    const found = builtInThemes.find((t) => t.id === presetId);
    if (found) {
      const cloned = JSON.parse(JSON.stringify(found));
      cloned.id = this.themeId();
      cloned.name = this.themeName();
      this.currentTheme.set(cloned);
    }
  }

  public resetToPreset(): void {
    const found = builtInThemes.find((t) => t.id === this.selectedPresetId()) || defaultTheme;
    const cloned = JSON.parse(JSON.stringify(found));
    cloned.id = this.themeId();
    cloned.name = this.themeName();
    this.currentTheme.set(cloned);
  }

  public getPrimaryScaleStep(step: keyof GpColorScale): string {
    const scale = this.currentTheme().primitives.colors.indigo || this.currentTheme().primitives.colors['gray'];
    return scale ? (scale as any)[step] || '#4f46e5' : '#4f46e5';
  }

  public onPrimaryHexChange(event: Event): void {
    const hex = (event.target as HTMLInputElement).value;
    if (!hex || hex.length < 4) return;

    const newScale = generateColorScale(hex);
    const curr = JSON.parse(JSON.stringify(this.currentTheme()));

    // Update primary scale ramp
    curr.primitives.colors.indigo = newScale;

    // Update Light mode semantic primary
    curr.light.semantic.primary.main = hex;
    curr.light.semantic.primary.hover = newScale[600];
    curr.light.semantic.primary.active = newScale[700];
    curr.light.semantic.primary.light = newScale[100];
    curr.light.semantic.primaryScale = newScale;

    // Update Dark mode semantic primary
    curr.dark.semantic.primary.main = newScale[400];
    curr.dark.semantic.primary.hover = newScale[300];
    curr.dark.semantic.primary.active = newScale[200];
    curr.dark.semantic.primary.light = newScale[900];
    curr.dark.semantic.primaryScale = newScale;

    this.currentTheme.set(curr);
  }

  public updateRadius(key: string, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    const curr = JSON.parse(JSON.stringify(this.currentTheme()));
    (curr.primitives.borderRadius as any)[key] = val;
    this.currentTheme.set(curr);
  }

  public updateFont(key: string, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    const curr = JSON.parse(JSON.stringify(this.currentTheme()));
    (curr.primitives.typography.fontFamily as any)[key] = val;
    this.currentTheme.set(curr);
  }

  public updateFontSize(key: string, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    const curr = JSON.parse(JSON.stringify(this.currentTheme()));
    (curr.primitives.typography.fontSize as any)[key] = val;
    this.currentTheme.set(curr);
  }

  public updateSemantic(group: string, key: string, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    const curr = JSON.parse(JSON.stringify(this.currentTheme()));
    const modeObj = this.editMode() === 'dark' ? curr.dark.semantic : curr.light.semantic;
    if (modeObj[group]) {
      modeObj[group][key] = val;
    }
    this.currentTheme.set(curr);
  }

  public updateSurface(key: string, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    const curr = JSON.parse(JSON.stringify(this.currentTheme()));
    const modeObj = this.editMode() === 'dark' ? curr.dark.semantic : curr.light.semantic;
    modeObj.surfaces[key] = val;
    this.currentTheme.set(curr);
  }

  public updateTextToken(key: string, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    const curr = JSON.parse(JSON.stringify(this.currentTheme()));
    const modeObj = this.editMode() === 'dark' ? curr.dark.semantic : curr.light.semantic;
    modeObj.text[key] = val;
    this.currentTheme.set(curr);
  }

  public getCompToken(comp: string, tokenKey: string): string {
    const modeObj = this.editMode() === 'dark' ? this.currentTheme().dark : this.currentTheme().light;
    const compObj = modeObj.components?.[comp];
    return compObj?.[tokenKey] || '';
  }

  public updateCompToken(comp: string, tokenKey: string, event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    const curr = JSON.parse(JSON.stringify(this.currentTheme()));
    const modeObj = this.editMode() === 'dark' ? curr.dark : curr.light;
    if (!modeObj.components) modeObj.components = {};
    if (!modeObj.components[comp]) modeObj.components[comp] = {};
    modeObj.components[comp][tokenKey] = val;
    this.currentTheme.set(curr);
  }

  public currentExportCode = computed(() => {
    const theme = this.currentTheme();
    const activeIdTheme = { ...theme, id: this.themeId(), name: this.themeName() };
    switch (this.exportFormat()) {
      case 'css':
        return themeToCss(activeIdTheme);
      case 'typescript':
        return themeToTypeScript(activeIdTheme);
      case 'json':
        return themeToJson(activeIdTheme);
      case 'angular':
        return themeToAngularSetup(activeIdTheme);
    }
  });

  public exportLanguage = computed(() => {
    switch (this.exportFormat()) {
      case 'css': return 'css';
      case 'typescript': return 'typescript';
      case 'json': return 'json';
      case 'angular': return 'typescript';
    }
  });

  public copyToClipboard(): void {
    const code = this.currentExportCode();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }
  }

  public downloadExportFile(): void {
    const code = this.currentExportCode();
    const format = this.exportFormat();
    const ext = format === 'css' ? 'css' : format === 'json' ? 'json' : 'ts';
    const filename = `${this.themeId()}.${ext}`;

    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
