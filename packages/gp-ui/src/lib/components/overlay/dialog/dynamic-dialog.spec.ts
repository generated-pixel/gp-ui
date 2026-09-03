import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDynamicDialog } from './dynamic-dialog';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: '<p>Dialog Inner Content</p>'
})
class InnerContentComponent {}

describe('GpDynamicDialog', () => {
  let fixture: ComponentFixture<GpDynamicDialog>;
  let component: GpDynamicDialog;

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
      close: jasmine.createSpy('close'),
      destroy: jasmine.createSpy('destroy'),
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
    expect(component.maximized()).toBeFalse();
    component.toggleMaximize();
    expect(component.maximized()).toBeTrue();
  });
});
