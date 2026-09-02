import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDivider } from './divider';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpDivider],
  template: `
    <gp-divider layout="horizontal" type="dashed" align="center">OR</gp-divider>
  `
})
class TestHostComponent {}

describe('GpDivider', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpDivider]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render horizontal dashed divider with content', () => {
    const divider = fixture.nativeElement.querySelector('.gp-divider');
    expect(divider).toBeTruthy();
    expect(divider.classList.contains('gp-divider-horizontal')).toBeTrue();
    expect(divider.classList.contains('gp-divider-dashed')).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('OR');
  });
});
