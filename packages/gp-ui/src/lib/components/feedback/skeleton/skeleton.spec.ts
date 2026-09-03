import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpSkeleton } from './skeleton';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpSkeleton],
  template: ` <gp-skeleton shape="circle" width="3rem" height="3rem" /> `
})
class TestHostComponent {}

describe('GpSkeleton', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpSkeleton]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render skeleton with circle shape and dimensions', () => {
    const skeleton = fixture.nativeElement.querySelector('.gp-skeleton');
    expect(skeleton).toBeTruthy();
    expect(skeleton.classList.contains('gp-skeleton--circle')).toBeTrue();
    expect(skeleton.style.width).toBe('3rem');
    expect(skeleton.style.height).toBe('3rem');
  });
});
