import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpPanel } from './panel';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpPanel],
  template: `
    <gp-panel header="System Status" [toggleable]="true">
      <p>All services are operational.</p>
    </gp-panel>
  `
})
class TestHostComponent {}

describe('GpPanel', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpPanel]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render panel header and body', () => {
    const panel = fixture.nativeElement.querySelector('.gp-panel');
    expect(panel).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('System Status');
    expect(fixture.nativeElement.textContent).toContain('All services are operational.');
  });
});
