import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpSplitter, GpSplitterPanel } from './splitter';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpSplitter, GpSplitterPanel],
  template: `
    <gp-splitter layout="horizontal">
      <gp-splitter-panel [size]="40">Left Pane</gp-splitter-panel>
      <gp-splitter-panel [size]="60">Right Pane</gp-splitter-panel>
    </gp-splitter>
  `
})
class TestHostComponent {}

describe('GpSplitter', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpSplitter, GpSplitterPanel]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render horizontal splitter container and panels', () => {
    const splitter = fixture.nativeElement.querySelector('.gp-splitter');
    expect(splitter).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Left Pane');
    expect(fixture.nativeElement.textContent).toContain('Right Pane');
  });
});
