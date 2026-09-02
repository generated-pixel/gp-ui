import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpMenu } from './menu';
import { Component } from '@angular/core';
import { GpMenuItem } from '../../button/split-button/split-button';
import { provideRouter } from '@angular/router';

@Component({
  standalone: true,
  imports: [GpMenu],
  template: `
    <gp-menu [model]="items" [popup]="false" />
  `
})
class TestHostComponent {
  items: GpMenuItem[] = [
    { label: 'Profile', icon: 'user' },
    { label: 'Settings', icon: 'sliders' }
  ];
}

describe('GpMenu', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpMenu],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render menu list and items', () => {
    const menuEl = fixture.nativeElement.querySelector('.gp-menu');
    expect(menuEl).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Profile');
    expect(fixture.nativeElement.textContent).toContain('Settings');
  });
});
