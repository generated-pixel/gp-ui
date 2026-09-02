import { Component, input } from '@angular/core';

export interface DocApiProperty {
  name: string;
  type: string;
  default?: string;
  description: string;
  kind?: 'input' | 'output' | 'model' | 'query' | 'prop';
}

@Component({
  selector: 'doc-api-table',
  standalone: true,
  imports: [],
  template: `
    <div class="doc-api-container">
      <div class="doc-api-header">
        <h3 class="doc-api-title">{{ title() }}</h3>
      </div>
      <div class="doc-table-wrapper">
        <table class="doc-api-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type / Signal API</th>
              @if (hasDefaults()) {
                <th>Default</th>
              }
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            @for (prop of properties(); track prop.name || $index) {
              <tr>
                <td class="doc-prop-name">
                  <code>{{ prop.name }}</code>
                </td>
                <td class="doc-prop-type">
                  <span class="doc-type-badge">{{ prop.type }}</span>
                </td>
                @if (hasDefaults()) {
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
            } @empty {
              <tr>
                <td [attr.colspan]="hasDefaults() ? 4 : 3" class="doc-empty-row">No properties specified.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      .doc-api-container {
        margin: 1.5rem 0;
        background: var(--gp-surface-card);
        border: 1px solid var(--gp-surface-border);
        border-radius: var(--gp-border-radius-md, 8px);
        overflow: hidden;
        box-shadow: var(--gp-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05));
      }
      .doc-api-header {
        padding: 0.85rem 1.25rem;
        background: var(--gp-surface-section, var(--gp-surface-ground));
        border-bottom: 1px solid var(--gp-surface-border);
      }
      .doc-api-title {
        margin: 0;
        font-size: 1rem;
        font-weight: 700;
        color: var(--gp-text-color);
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
        color: var(--gp-text-color-secondary);
        background: var(--gp-surface-ground);
        border-bottom: 1px solid var(--gp-surface-border);
      }
      .doc-api-table td {
        padding: 0.85rem 1.25rem;
        border-bottom: 1px solid var(--gp-surface-border);
        color: var(--gp-text-color);
        vertical-align: top;
      }
      .doc-api-table tr:last-child td {
        border-bottom: none;
      }
      .doc-prop-name code {
        font-weight: 700;
        color: var(--gp-primary);
        background: var(--gp-primary-light, rgba(59, 130, 246, 0.1));
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
        background: var(--gp-surface-ground);
        color: var(--gp-text-color-secondary);
        border: 1px solid var(--gp-surface-border);
      }
      .doc-prop-default code {
        color: var(--gp-danger, #e11d48);
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
      }
      .doc-none {
        color: var(--gp-text-color-muted);
      }
      .doc-prop-desc {
        line-height: 1.5;
      }
      .doc-empty-row {
        text-align: center;
        padding: 2rem !important;
        color: var(--gp-text-color-muted);
      }
    `
  ]
})
export class DocApiTableComponent {
  public title = input<string>('Properties (Inputs)');
  public properties = input<DocApiProperty[]>([]);
  public hasDefaults = input<boolean>(true);
}
