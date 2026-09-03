import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTieredMenu } from './tiered-menu';
import { Component } from '@angular/core';
import { GpMenubarItem } from '../menubar/menubar';
import { provideRouter } from '@angular/router';

@Component({
  standalone: true,
  imports: [GpTieredMenu],
  template: ' <gp-tiered-menu [model]="items" /> '
})
class TestHostComponent {
  items: GpMenubarItem[] = [
    {
      label: 'File',
      items: [{ label: 'New' }]
    }
  ];
}

describe('GpTieredMenu', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpTieredMenu],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should instantiate tiered menu component', () => {
    const tiered = fixture.debugElement.children[0].componentInstance as GpTieredMenu;
    expect(tiered).toBeTruthy();
    expect(tiered.popup()).toBe(false);
  });
});
