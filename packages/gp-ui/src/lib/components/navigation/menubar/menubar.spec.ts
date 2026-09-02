import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpMenubar, GpMenubarItem } from './menubar';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';

@Component({
  standalone: true,
  imports: [GpMenubar],
  template: `
    <gp-menubar [model]="items" />
  `
})
class TestHostComponent {
  items: GpMenubarItem[] = [
    {
      label: 'File',
      items: [{ label: 'New' }, { label: 'Open' }]
    },
    { label: 'Help' }
  ];
}

describe('GpMenubar', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpMenubar],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render menubar root items', () => {
    const menubarEl = fixture.nativeElement.querySelector('.gp-menubar');
    expect(menubarEl).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('File');
    expect(fixture.nativeElement.textContent).toContain('Help');
  });
});
