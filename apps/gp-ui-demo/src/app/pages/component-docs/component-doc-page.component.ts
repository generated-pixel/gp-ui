import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GpButtonComponent, GpBadgeComponent, GpMenuItem } from 'gp-ui';
import { GpIconComponent, GP_DEFAULT_ICONS } from 'gp-ui-icons';
import { DocApiTableComponent } from '../../shared/doc-api-table.component';
import { DocCodeComponent } from '../../shared/doc-code.component';
import { getComponentDoc } from './component-docs.data';

@Component({
  selector: 'app-component-doc-page',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpBadgeComponent, GpIconComponent, DocCodeComponent, DocApiTableComponent],
  template: `
    @if (doc) {
      <div class="page-container">
        <div class="page-header">
          <div class="title-row">
            <gp-badge [value]="doc.category" severity="secondary" />
            <h1>{{ doc.name }}</h1>
          </div>
          <p class="page-desc">{{ doc.description }}</p>
        </div>

        <div class="doc-section">
          <h2 class="doc-section-title">Import</h2>
          <doc-code [code]="doc.importStatement" language="typescript" />
        </div>

        <div class="doc-section">
          <h2 class="doc-section-title">Example</h2>
          <div class="doc-demo-box">
            <ng-container [ngTemplateOutlet]="exampleTemplate"></ng-container>
          </div>
          <doc-code [code]="doc.exampleCode" language="html" />
        </div>

        <div class="doc-section">
          <h2 class="doc-section-title">API Reference</h2>
          <doc-api-table title="Inputs" [properties]="doc.properties" />
          @if (doc.events?.length) {
            <doc-api-table title="Events" [properties]="doc.events" [hasDefaults]="false" />
          }
        </div>

        @if (doc.slug === 'icon') {
          <div class="doc-section">
            <div class="icon-header-row">
              <h2 class="doc-section-title" style="margin: 0;">Available Icons ({{ filteredIconNames.length }})</h2>
              <input
                type="text"
                placeholder="Search icons..."
                class="icon-search-input"
                (input)="onIconSearch($any($event.target).value)"
              />
            </div>
            <div class="icon-grid">
              @for (iconName of filteredIconNames; track iconName) {
                <div class="icon-card">
                  <gp-icon [name]="iconName" size="1.75em" />
                  <span class="icon-name">{{ iconName }}</span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="page-container">
        <div class="page-header">
          <h1>Component not found</h1>
          <p class="page-desc">This component documentation page does not exist yet.</p>
        </div>
      </div>
    }

    <ng-template #exampleTemplate>
      @switch (doc?.slug) {
        @case ('button') {
          <gp-button label="Primary" severity="primary" />
          <gp-button label="Outlined" variant="outlined" severity="secondary" />
        }
        @case ('split-button') {
          <gp-button label="Save" severity="primary" />
        }
        @case ('speed-dial') {
          <gp-button label="Quick actions" severity="primary" />
        }
        @case ('input-text') {
          <label style="display:block; min-width: 220px;">
            <span style="display:block; margin-bottom:0.5rem;">Name</span>
            <input type="text" value="Jane Doe" style="width:100%; padding:0.7rem 0.8rem; border-radius:6px; border:1px solid var(--gp-surface-border); background: var(--gp-surface-card); color: var(--gp-text-color);" />
          </label>
        }
        @case ('select') {
          <select style="min-width: 220px; padding: 0.7rem 0.8rem; border-radius: 6px; border: 1px solid var(--gp-surface-border); background: var(--gp-surface-card); color: var(--gp-text-color);">
            <option>Designer</option>
            <option>Developer</option>
            <option>Manager</option>
          </select>
        }
        @case ('table') {
          <div style="display:flex; flex-direction:column; gap:0.5rem; min-width:260px;">
            <div style="display:flex; justify-content:space-between; padding:0.5rem 0.75rem; border:1px solid var(--gp-surface-border); border-radius:6px;">
              <span>Name</span><span>Status</span>
            </div>
            <div style="display:flex; justify-content:space-between; padding:0.5rem 0.75rem; border:1px solid var(--gp-surface-border); border-radius:6px;">
              <span>Alpha</span><span>Ready</span>
            </div>
          </div>
        }
        @case ('tabs') {
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <gp-button label="Overview" severity="primary" />
            <gp-button label="Details" variant="outlined" severity="secondary" />
          </div>
        }
        @case ('dialog') {
          <gp-button label="Open Dialog" severity="primary" />
        }
        @case ('card') {
          <div style="padding:1rem; border:1px solid var(--gp-surface-border); border-radius:8px; min-width:220px;">
            <strong>Project Summary</strong>
            <p style="margin:0.5rem 0 0;">A concise overview of the project state.</p>
          </div>
        }
        @case ('message') {
          <div style="padding:0.75rem 1rem; border-radius:8px; border:1px solid var(--gp-surface-border); background: rgba(34,197,94,0.08); color: var(--gp-text-color); min-width:220px;">
            Saved successfully
          </div>
        }
        @case ('avatar') {
          <div style="width: 48px; height: 48px; border-radius:50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display:flex; align-items:center; justify-content:center; color:white; font-weight:700;">JD</div>
        }
        @case ('badge') {
          <gp-badge [value]="'New'" severity="primary" />
        }
        @case ('icon') {
          <div style="display:flex; align-items:center; gap:0.75rem; min-width:220px;">
            <gp-icon name="search" size="1.5em" />
            <gp-icon name="check-circle" size="1.5em" color="var(--gp-success)" />
            <gp-icon name="star-fill" size="1.5em" color="var(--gp-warning)" />
          </div>
        }
        @default {
          <gp-button label="Example" severity="primary" />
        }
      }
    </ng-template>
  `,
  styles: [
    `
      .title-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      .title-row h1 {
        margin: 0;
      }
      .doc-demo-box {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
        padding: 1.25rem;
        border: 1px solid var(--gp-surface-border);
        border-radius: var(--gp-border-radius-md, 8px);
        background: var(--gp-surface-card);
      }
      .icon-header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        flex-wrap: wrap;
        gap: 0.75rem;
      }
      .icon-search-input {
        padding: 0.5rem 0.75rem;
        border-radius: var(--gp-border-radius-md, 6px);
        border: 1px solid var(--gp-surface-border);
        background: var(--gp-surface-card);
        color: var(--gp-text-color);
        font-size: 0.9rem;
        outline: none;
        min-width: 200px;
      }
      .icon-search-input:focus {
        border-color: var(--gp-primary-color, #6366f1);
      }
      .icon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 0.75rem;
      }
      .icon-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem 0.5rem;
        border: 1px solid var(--gp-surface-border);
        border-radius: var(--gp-border-radius-md, 8px);
        background: var(--gp-surface-card);
        transition: transform 0.15s ease, border-color 0.15s ease;
      }
      .icon-card:hover {
        transform: translateY(-2px);
        border-color: var(--gp-primary-color, #6366f1);
      }
      .icon-name {
        font-size: 0.75rem;
        color: var(--gp-text-color-secondary);
        font-family: monospace;
        word-break: break-all;
        text-align: center;
      }
    `
  ]
})
export class ComponentDocPageComponent implements OnInit {
  doc: ReturnType<typeof getComponentDoc>;
  allIconNames: string[] = Object.keys(GP_DEFAULT_ICONS);
  searchTerm = '';

  get filteredIconNames(): string[] {
    if (!this.searchTerm.trim()) {
      return this.allIconNames;
    }
    const term = this.searchTerm.toLowerCase();
    return this.allIconNames.filter(name => name.toLowerCase().includes(term));
  }

  onIconSearch(value: string): void {
    this.searchTerm = value;
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('component');
      this.doc = slug ? getComponentDoc(slug) : undefined;
    });
  }
}
