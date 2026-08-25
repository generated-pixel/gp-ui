import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import {
  GpButtonComponent,
  GpInputTextComponent,
  GpSelectComponent,
  GpTableComponent,
  GpColumnComponent,
  GpDialogComponent,
  GpToastComponent,
  GpToastService,
  GpTranslationService,
  GP_SPANISH_TRANSLATION
} from 'gp-ui';
import { GpIconComponent } from 'gp-ui-icons';

@Component({
  selector: 'app-consumer-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GpButtonComponent,
    GpInputTextComponent,
    GpSelectComponent,
    GpTableComponent,
    GpColumnComponent,
    GpDialogComponent,
    GpToastComponent,
    GpIconComponent
  ],
  template: `
    <div class="consumer-app">
      <h1>gp-ui Consumer Test Application</h1>
      <p>Testing npm installation of gp-ui from clean consumer perspective.</p>

      <gp-toast />

      <div class="section">
        <h3>Buttons & Actions</h3>
        <gp-button label="Consumer Action" severity="primary" (onClickEvent)="showToast()" />
      </div>

      <div class="section">
        <h3>Forms with Reactive Forms</h3>
        <gp-input-text [formControl]="nameControl" placeholder="Enter name" />
      </div>

      <div class="section">
        <h3>Data Table</h3>
        <gp-table [value]="users" [paginator]="true" [rows]="2">
          <gp-column field="id" header="ID" />
          <gp-column field="name" header="Name" [sortable]="true" />
          <gp-column field="role" header="Role" />
        </gp-table>
      </div>

      <div class="section">
        <h3>i18n Switcher</h3>
        <gp-button label="Switch to Spanish" severity="secondary" (onClickEvent)="switchToSpanish()" />
      </div>
    </div>
  `
})
export class ConsumerAppComponent {
  private toastService = inject(GpToastService);
  private translationService = inject(GpTranslationService);

  nameControl = new FormControl('Jane Consumer');

  users = [
    { id: 1, name: 'Consumer 1', role: 'Tester' },
    { id: 2, name: 'Consumer 2', role: 'Developer' },
    { id: 3, name: 'Consumer 3', role: 'Architect' }
  ];

  showToast(): void {
    this.toastService.success('Consumer Test Passed', 'gp-ui package consumed cleanly!');
  }

  switchToSpanish(): void {
    this.translationService.setTranslation(GP_SPANISH_TRANSLATION);
  }
}
