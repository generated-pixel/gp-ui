import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpScrollPanel } from './scroll-panel';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpScrollPanel],
  template: `
    <gp-scroll-panel height="200px">
      <div style="height: 600px;">Long Content</div>
    </gp-scroll-panel>
  `
})
class TestHostComponent {}

describe('GpScrollPanel', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpScrollPanel]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render scroll panel with specified height', () => {
    const el = fixture.nativeElement.querySelector('.gp-scroll-panel');
    expect(el).toBeTruthy();
    expect(el.style.height).toBe('200px');
  });
});
