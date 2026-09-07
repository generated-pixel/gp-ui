import { Component, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GpBadge, GpButton, GpIcon, GpTextarea } from 'gp-ui';
import { GpDynamicBlockRenderer, GpBlockMetadata, GP_SCHEMA_PRESETS } from 'gp-blocks';

@Component({
  selector: 'app-blocks-playground-page',
  standalone: true,
  imports: [FormsModule, RouterModule, GpBadge, GpButton, GpIcon, GpTextarea, GpDynamicBlockRenderer],
  templateUrl: './blocks-playground.html',
  styleUrl: './blocks-playground.scss'
})
export class BlocksPlaygroundPage {
  selectedPreset: 'profile' | 'onboarding' | 'checkout' | 'kpi' = 'profile';
  rawJson = '';
  parsedMetadata: GpBlockMetadata | null = null;
  jsonError: string | null = null;

  logs: Array<{ time: string; type: string; detail: string }> = [];

  constructor() {
    this.loadPreset('profile');
  }

  loadPreset(preset: 'profile' | 'onboarding' | 'checkout' | 'kpi') {
    this.selectedPreset = preset;
    let obj: GpBlockMetadata;

    if (preset === 'profile') {
      obj = GP_SCHEMA_PRESETS['userProfileSettings'];
    } else if (preset === 'onboarding') {
      obj = GP_SCHEMA_PRESETS['enterpriseOnboarding'];
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
