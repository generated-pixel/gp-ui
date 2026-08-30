import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent } from 'gp-ui';
import {
  GpDynamicBlockRendererComponent,
  GpBlockMetadata,
  GP_SCHEMA_PRESETS
} from 'gp-blocks';

@Component({
  selector: 'app-blocks-playground-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    GpBadgeComponent,
    GpIconComponent,
    GpDynamicBlockRendererComponent
  ],
  template: `
    <div class="playground-root">
      <!-- Header -->
      <div class="playground-header">
        <div>
          <div class="crumb-link">
            <a routerLink="/blocks">&larr; Back to Blocks Gallery</a>
          </div>
          <h1 class="p-title">Dynamic JSON Schema Playground</h1>
          <p class="p-subtitle">
            Author and test JSON metadata schemas that dynamically generate responsive forms, headers, and KPI metrics.
          </p>
        </div>

        <!-- Presets Selector -->
        <div class="presets-toolbar">
          <span class="p-lbl">Presets:</span>
          <button
            type="button"
            class="p-btn"
            [class.active]="selectedPreset === 'profile'"
            (click)="loadPreset('profile')"
          >
            User Profile Settings
          </button>
          <button
            type="button"
            class="p-btn"
            [class.active]="selectedPreset === 'checkout'"
            (click)="loadPreset('checkout')"
          >
            Ecommerce Checkout
          </button>
          <button
            type="button"
            class="p-btn"
            [class.active]="selectedPreset === 'kpi'"
            (click)="loadPreset('kpi')"
          >
            SaaS KPI Dashboard
          </button>
        </div>
      </div>

      <!-- Playground Editor & Preview Split Panes -->
      <div class="playground-panes">
        <!-- Left: JSON Schema Editor -->
        <div class="editor-pane">
          <div class="pane-head">
            <div class="head-title">
              <gp-icon name="code" size="0.9em" />
              <span>JSON Schema Definition</span>
            </div>
            <div class="head-actions">
              <button type="button" class="btn-sm" (click)="formatJson()">Format</button>
              <button type="button" class="btn-sm" (click)="resetToCurrentPreset()">Reset</button>
            </div>
          </div>

          <div class="editor-body">
            <textarea
              class="json-textarea"
              [(ngModel)]="rawJson"
              (ngModelChange)="onJsonChange($event)"
              spellcheck="false"
            ></textarea>
          </div>

          <div *ngIf="jsonError" class="json-error-banner">
            <gp-icon name="exclamation-triangle" size="0.9em" />
            <span>{{ jsonError }}</span>
          </div>
        </div>

        <!-- Right: Live Rendered Output & Event Logs -->
        <div class="preview-pane">
          <div class="pane-head">
            <div class="head-title">
              <gp-icon name="sparkles" size="0.9em" />
              <span>Live Dynamic Renderer</span>
            </div>
            <gp-badge value="Live Preview" severity="success" />
          </div>

          <div class="preview-body">
            <gp-dynamic-block-renderer
              *ngIf="parsedMetadata"
              [metadata]="parsedMetadata"
              (formSubmit)="onFormSubmit($event)"
              (formChange)="onFormChange($event)"
              (actionClick)="onActionClick($event)"
            />
          </div>

          <!-- Event Log Drawer -->
          <div class="event-log-box">
            <div class="log-head">
              <span>Event Stream Log ({{ logs.length }} Events)</span>
              <button type="button" class="btn-clear" (click)="logs = []">Clear</button>
            </div>
            <div class="log-list">
              <div *ngIf="logs.length === 0" class="log-empty">No events emitted yet. Interact with the form above!</div>
              <div *ngFor="let log of logs" class="log-row">
                <span class="log-time">{{ log.time }}</span>
                <span class="log-type" [class.submit]="log.type === 'SUBMIT'" [class.action]="log.type === 'ACTION'">
                  [{{ log.type }}]
                </span>
                <span class="log-detail">{{ log.detail }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .playground-root {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding-bottom: 3rem;
      }

      .crumb-link a {
        font-size: 0.825rem;
        color: var(--gp-primary);
        text-decoration: none;
        font-weight: 600;
      }

      .p-title {
        font-size: 1.875rem;
        font-weight: 900;
        letter-spacing: -0.03em;
        margin: 0.25rem 0 0 0;
        color: #ffffff;
      }

      .p-subtitle {
        font-size: 0.95rem;
        color: var(--gp-text-color-secondary);
        margin: 0.25rem 0 0 0;
      }

      .playground-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        flex-wrap: wrap;
        gap: 1rem;
        border-bottom: 1px solid var(--gp-surface-border);
        padding-bottom: 1.5rem;
      }

      .presets-toolbar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .p-lbl {
        font-size: 0.8rem;
        color: var(--gp-text-color-secondary);
        font-weight: 600;
      }

      .p-btn {
        padding: 0.4rem 0.75rem;
        border-radius: 6px;
        border: 1px solid var(--gp-surface-border);
        background: var(--gp-surface-section);
        color: var(--gp-text-color-secondary);
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .p-btn:hover {
        background: var(--gp-surface-hover);
        color: var(--gp-text-color);
      }

      .p-btn.active {
        background: var(--gp-primary);
        border-color: var(--gp-primary);
        color: var(--gp-primary-text);
      }

      .playground-panes {
        display: grid;
        grid-template-columns: 480px 1fr;
        gap: 1.5rem;
        min-height: 700px;
      }

      .editor-pane, .preview-pane {
        background: var(--gp-surface-card);
        border: 1px solid var(--gp-surface-border);
        border-radius: 14px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .pane-head {
        padding: 0.85rem 1.25rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--gp-surface-border);
        background: var(--gp-surface-section);
      }

      .head-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--gp-text-color);
      }

      .head-actions {
        display: flex;
        gap: 0.35rem;
      }

      .btn-sm {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        border: 1px solid var(--gp-surface-border);
        background: var(--gp-surface-card);
        color: var(--gp-text-color-secondary);
        font-size: 0.75rem;
        cursor: pointer;
      }

      .btn-sm:hover {
        background: var(--gp-surface-hover);
        color: var(--gp-text-color);
      }

      .editor-body {
        flex: 1;
        display: flex;
      }

      .json-textarea {
        flex: 1;
        width: 100%;
        background: var(--gp-surface-ground);
        color: var(--gp-primary);
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.825rem;
        padding: 1rem;
        border: none;
        outline: none;
        resize: none;
        line-height: 1.45;
      }

      .json-error-banner {
        background: var(--gp-danger-light, #fef2f2);
        color: var(--gp-danger, #ef4444);
        padding: 0.75rem 1rem;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border-top: 1px solid var(--gp-danger-border, #fecaca);
      }

      .preview-body {
        flex: 1;
        padding: 1.5rem;
        background: var(--gp-surface-ground);
        overflow-y: auto;
      }

      .event-log-box {
        border-top: 1px solid var(--gp-surface-border);
        background: var(--gp-surface-section);
        height: 160px;
        display: flex;
        flex-direction: column;
      }

      .log-head {
        padding: 0.4rem 0.85rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--gp-surface-card);
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--gp-text-color-muted);
      }

      .btn-clear {
        background: transparent;
        border: none;
        color: var(--gp-text-color-muted);
        cursor: pointer;
        font-size: 0.7rem;
      }

      .btn-clear:hover { color: var(--gp-text-color); }

      .log-list {
        flex: 1;
        padding: 0.5rem 0.85rem;
        overflow-y: auto;
        font-family: ui-monospace, monospace;
        font-size: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .log-empty { color: var(--gp-text-color-muted); font-style: italic; }

      .log-row {
        display: flex;
        gap: 0.5rem;
      }

      .log-time { color: var(--gp-text-color-muted); }
      .log-type { font-weight: 700; }
      .log-type.submit { color: var(--gp-success, #10b981); }
      .log-type.action { color: var(--gp-primary); }
      .log-detail { color: var(--gp-text-color); }

      @media (max-width: 1024px) {
        .playground-panes { grid-template-columns: 1fr; }
        .editor-pane { height: 350px; }
      }
    `
  ]
})
export class BlocksPlaygroundPageComponent {
  selectedPreset: 'profile' | 'checkout' | 'kpi' = 'profile';
  rawJson = '';
  parsedMetadata: GpBlockMetadata | null = null;
  jsonError: string | null = null;

  logs: Array<{ time: string; type: string; detail: string }> = [];

  constructor() {
    this.loadPreset('profile');
  }

  loadPreset(preset: 'profile' | 'checkout' | 'kpi') {
    this.selectedPreset = preset;
    let obj: GpBlockMetadata;

    if (preset === 'profile') {
      obj = GP_SCHEMA_PRESETS['userProfileSettings'];
    } else if (preset === 'checkout') {
      obj = GP_SCHEMA_PRESETS['ecommerceCheckout'];
    } else {
      obj = GP_SCHEMA_PRESETS['saasKpiDashboard'];
    }

    this.rawJson = JSON.stringify(obj, null, 2);
    this.parsedMetadata = JSON.parse(this.rawJson);
    this.jsonError = null;
  }

  onJsonChange(val: string) {
    try {
      this.parsedMetadata = JSON.parse(val);
      this.jsonError = null;
    } catch (e: any) {
      this.jsonError = e.message;
    }
  }

  formatJson() {
    try {
      const obj = JSON.parse(this.rawJson);
      this.rawJson = JSON.stringify(obj, null, 2);
      this.jsonError = null;
    } catch (e: any) {
      this.jsonError = e.message;
    }
  }

  resetToCurrentPreset() {
    this.loadPreset(this.selectedPreset);
  }

  onFormSubmit(formValue: Record<string, any>) {
    this.logs.unshift({
      time: new Date().toLocaleTimeString(),
      type: 'SUBMIT',
      detail: JSON.stringify(formValue)
    });
  }

  onFormChange(formValue: Record<string, any>) {
    //
  }

  onActionClick(action: any) {
    this.logs.unshift({
      time: new Date().toLocaleTimeString(),
      type: 'ACTION',
      detail: `Action clicked: ${action.label || action.id}`
    });
  }
}
