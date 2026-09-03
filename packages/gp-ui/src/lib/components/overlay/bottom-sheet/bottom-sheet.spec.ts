import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpBottomSheet } from './bottom-sheet';
import { GpBottomSheetService } from './bottom-sheet.service';
import { Component, signal } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpBottomSheet],
  template: ' <gp-bottom-sheet [visible]="isVisible()" title="Quick Options" /> '
})
class TestHostComponent {
  isVisible = signal(false);
}

describe('GpBottomSheet', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let service: GpBottomSheetService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpBottomSheet],
      providers: [GpBottomSheetService]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    service = TestBed.inject(GpBottomSheetService);
    fixture.detectChanges();
  });

  it('should toggle service open state', () => {
    expect(service.isOpen()).toBe(false);
    service.open();
    expect(service.isOpen()).toBe(true);
    service.close();
    expect(service.isOpen()).toBe(false);
  });

  it('should update bottom sheet visibility when signal changes', () => {
    hostComponent.isVisible.set(true);
    fixture.detectChanges();

    const sheet = document.querySelector('.gp-bottom-sheet');
    expect(sheet).toBeTruthy();
  });
});
