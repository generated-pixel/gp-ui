import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDynamicDialog } from './dynamic-dialog';
import { Component } from '@angular/core';
import { vi } from 'vitest';

@Component({
  standalone: true,
  template: '<div class="inner-content">Inner Modal Content</div>'
})
class InnerContentComponent {}

describe('GpDynamicDialog', () => {
  let component: GpDynamicDialog;
  let fixture: ComponentFixture<GpDynamicDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpDynamicDialog, InnerContentComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpDynamicDialog);
    component = fixture.componentInstance;
    component.config = {
      header: 'Test Dialog',
      dismissableMask: true
    };
    component.dialogRef = {
      close: vi.fn(),
      destroy: vi.fn(),
      onClose$: { subscribe: () => ({ unsubscribe: () => {} }) } as any
    } as any;
    component.childComponentType = InnerContentComponent;
    fixture.detectChanges();
  });

  it('should render dynamic dialog container and header', () => {
    const dialogEl = fixture.nativeElement.querySelector('.gp-dialog');
    expect(dialogEl).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Test Dialog');
  });

  it('should toggle maximized state', () => {
    expect(component.maximized()).toBe(false);
    component.toggleMaximize();
    expect(component.maximized()).toBe(true);
  });
});
