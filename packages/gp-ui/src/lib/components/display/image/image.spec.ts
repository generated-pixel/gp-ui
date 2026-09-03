import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpImage } from './image';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpImage],
  template: ' <gp-image src="test.png" alt="Test Image" [preview]="true" /> '
})
class TestHostComponent {}

describe('GpImage', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let imageComponent: GpImage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpImage]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    imageComponent = fixture.debugElement.children[0].componentInstance;
  });

  it('should render image element with preview trigger', () => {
    const imgEl = fixture.nativeElement.querySelector('.gp-image-img');
    expect(imgEl).toBeTruthy();
    expect(imgEl.getAttribute('src')).toBe('test.png');
    expect(imgEl.getAttribute('alt')).toBe('Test Image');
  });

  it('should toggle preview modal visibility and zoom', () => {
    expect((imageComponent as any).previewVisible()).toBe(false);
    imageComponent.showPreview();
    fixture.detectChanges();

    expect((imageComponent as any).previewVisible()).toBe(true);
    imageComponent.zoomIn();
    expect((imageComponent as any).scale()).toBe(1.25);
  });
});
