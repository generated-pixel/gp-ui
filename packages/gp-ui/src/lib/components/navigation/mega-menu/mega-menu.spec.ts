import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpMegaMenu, GpMegaMenuItem } from './mega-menu';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';

@Component({
  standalone: true,
  imports: [GpMegaMenu],
  template: ` <gp-mega-menu [model]="items" orientation="horizontal" /> `
})
class TestHostComponent {
  items: GpMegaMenuItem[] = [
    {
      label: 'Products',
      root: true,
      columns: [
        {
          label: 'Components',
          items: [{ label: 'Buttons', icon: 'check' }]
        }
      ]
    }
  ];
}

describe('GpMegaMenu', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpMegaMenu],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render mega-menu root bar', () => {
    const menuEl = fixture.nativeElement.querySelector('.gp-megamenu');
    expect(menuEl).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Products');
  });
});
