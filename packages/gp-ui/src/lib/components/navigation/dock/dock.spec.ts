import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDock } from './dock';
import { Component } from '@angular/core';
import { GpMenuItem } from '../../button/split-button/split-button';
import { provideRouter } from '@angular/router';

@Component({
  standalone: true,
  imports: [GpDock],
  template: `
    <gp-dock [model]="items" position="bottom" />
  `
})
class TestHostComponent {
  items: GpMenuItem[] = [
    { label: 'Finder', icon: 'folder' },
    { label: 'Settings', icon: 'sliders' }
  ];
}

describe('GpDock', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpDock],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render dock items with tooltips', () => {
    const dockEl = fixture.nativeElement.querySelector('.gp-dock');
    expect(dockEl).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.gp-dock-item').length).toBe(2);
  });
});
