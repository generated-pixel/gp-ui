import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GpDialogComponent } from '../components/overlay/dialog/dialog.component';
import { GpDrawerComponent } from '../components/overlay/drawer/drawer.component';
import { GpPanelComponent } from '../components/panel/panel/panel.component';
import { GpFieldsetComponent } from '../components/panel/fieldset/fieldset.component';

@Component({
  standalone: true,
  imports: [GpDialogComponent, GpDrawerComponent, GpPanelComponent, GpFieldsetComponent],
  template: `
    <gp-dialog
      #dialogComp
      [header]="'Test Dialog'"
      [(visible)]="dialogVisible"
      (onShow)="dialogShowFired = true"
      (onHide)="dialogHideFired = true"
    >
      <p>Dialog Body</p>
    </gp-dialog>

    <gp-drawer #drawerComp [header]="'Test Drawer'" [(visible)]="drawerVisible">
      <p>Drawer Body</p>
    </gp-drawer>

    <gp-panel #panelComp [header]="'Test Panel'" [toggleable]="true" (onToggle)="panelToggleFired = true">
      <p>Panel Body</p>
    </gp-panel>

    <gp-fieldset #fieldsetComp [legend]="'Test Fieldset'" [toggleable]="true">
      <p>Fieldset Body</p>
    </gp-fieldset>
  `
})
class OverlayPanelTestHostComponent {
  dialogVisible = false;
  drawerVisible = false;
  dialogShowFired = false;
  dialogHideFired = false;
  panelToggleFired = false;
}

describe('Overlay & Panel Base Classes Architecture', () => {
  let fixture: ComponentFixture<OverlayPanelTestHostComponent>;
  let host: OverlayPanelTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayPanelTestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OverlayPanelTestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should handle show, close, and two-way visibility on GpOverlayBaseComponent', () => {
    const dialog = fixture.debugElement.children[0].componentInstance as GpDialogComponent;

    dialog.show();
    fixture.detectChanges();
    expect(dialog.visible()).toBeTrue();
    expect(host.dialogVisible).toBeTrue();
    expect(host.dialogShowFired).toBeTrue();

    dialog.close();
    fixture.detectChanges();
    expect(dialog.visible()).toBeFalse();
    expect(host.dialogVisible).toBeFalse();
    expect(host.dialogHideFired).toBeTrue();
  });

  it('should handle toggle, expand, collapse on GpPanelBaseComponent', () => {
    const panel = fixture.debugElement.children[2].componentInstance as GpPanelComponent;

    expect(panel.collapsed()).toBeFalse();
    panel.toggle();
    fixture.detectChanges();
    expect(panel.collapsed()).toBeTrue();
    expect(host.panelToggleFired).toBeTrue();

    panel.expand();
    fixture.detectChanges();
    expect(panel.collapsed()).toBeFalse();
  });
});
