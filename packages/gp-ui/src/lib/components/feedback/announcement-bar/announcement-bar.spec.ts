import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpAnnouncementBar } from './announcement-bar';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpAnnouncementBar],
  template: `
    <gp-announcement-bar
      message="New major release is now available!"
      severity="info"
      [dismissible]="true"
      (onDismiss)="dismissed = true"
    />
  `
})
class TestHostComponent {
  dismissed = false;
}

describe('GpAnnouncementBar', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let bar: GpAnnouncementBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpAnnouncementBar]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    bar = fixture.debugElement.children[0].componentInstance;
  });

  it('should render message text', () => {
    expect(fixture.nativeElement.textContent).toContain('New major release is now available!');
  });

  it('should trigger dismiss', () => {
    bar.dismiss();
    expect((bar as any).isDismissing()).toBe(true);
  });
});
