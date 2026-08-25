import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DocApiProperty {
  name: string;
  type: string;
  default?: string;
  description: string;
}

@Component({
  selector: 'doc-api-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="doc-api-container">
      <div class="doc-api-header">
        <h3 class="doc-api-title">{{ title }}</h3>
      </div>
      <div class="doc-table-wrapper">
        <table class="doc-api-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              @if (hasDefaults) {
                <th>Default</th>
              }
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            @for (prop of properties; track prop.name) {
              <tr>
                <td class="doc-prop-name">
                  <code>{{ prop.name }}</code>
                </td>
                <td class="doc-prop-type">
                  <span class="doc-type-badge">{{ prop.type }}</span>
                </td>
                @if (hasDefaults) {
                  <td class="doc-prop-default">
                    @if (prop.default) {
                      <code>{{ prop.default }}</code>
                    } @else {
                      <span class="doc-none">-</span>
                    }
                  </td>
                }
                <td class="doc-prop-desc">{{ prop.description }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .doc-api-container {
      margin: 1.5rem 0;
      background: var(--gp-surface-card, #ffffff);
      border: 1px solid var(--gp-surface-border, #e2e8f0);
      border-radius: var(--gp-border-radius-md, 8px);
      overflow: hidden;
      box-shadow: var(--gp-shadow-sm, 0 1px 3px rgba(0,0,0,0.05));
    }
    .doc-api-header {
      padding: 0.85rem 1.25rem;
      background: var(--gp-surface-ground, #f8fafc);
      border-bottom: 1px solid var(--gp-surface-border, #e2e8f0);
    }
    .doc-api-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: var(--gp-text-color, #0f172a);
    }
    .doc-table-wrapper {
      overflow-x: auto;
    }
    .doc-api-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.875rem;
    }
    .doc-api-table th {
      padding: 0.75rem 1.25rem;
      font-weight: 600;
      color: var(--gp-text-color-secondary, #64748b);
      background: var(--gp-surface-ground, #f8fafc);
      border-bottom: 1px solid var(--gp-surface-border, #e2e8f0);
    }
    .doc-api-table td {
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid var(--gp-surface-divider, #f1f5f9);
      color: var(--gp-text-color, #334155);
      vertical-align: top;
    }
    .doc-api-table tr:last-child td {
      border-bottom: none;
    }
    .doc-prop-name code {
      font-weight: 700;
      color: var(--gp-primary, #3b82f6);
      background: var(--gp-primary-light, #eff6ff);
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.825rem;
    }
    .doc-type-badge {
      display: inline-block;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.775rem;
      font-weight: 600;
      background: var(--gp-surface-ground, #f1f5f9);
      color: var(--gp-text-color-secondary, #475569);
      border: 1px solid var(--gp-surface-border, #e2e8f0);
    }
    .doc-prop-default code {
      color: #e11d48;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
    }
    .doc-none {
      color: var(--gp-text-color-muted, #94a3b8);
    }
    .doc-prop-desc {
      line-height: 1.5;
    }
  `]
})
export class DocApiTableComponent {
  @Input() title = 'Properties (Inputs)';
  @Input() properties: DocApiProperty[] = [];
  @Input() hasDefaults = true;
}
