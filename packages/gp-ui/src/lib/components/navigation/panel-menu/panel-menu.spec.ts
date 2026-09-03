import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpPanelMenu } from './panel-menu';
import { Component } from '@angular/core';
import { GpMenubarItem } from '../menubar/menubar';
import { provideRouter } from '@angular/router';

@Component({
  standalone: true,
  imports: [GpPanelMenu],
  template: ` <gp-panel-menu [model]="items" [multiple]="true" /> `
})
class TestHostComponent {
  items: GpMenubarItem[] = [
    {
      label: 'Documents',
      icon: 'folder',
      items: [{ label: 'Work' }]
    }
  ];
}

describe('GpPanelMenu', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let panelMenu: GpPanelMenu;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpPanelMenu],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    panelMenu = fixture.debugElement.children[0].componentInstance;
  });

  it('should render panel menu and toggle items', () => {
    const el = fixture.nativeElement.querySelector('.gp-panelmenu');
    expect(el).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Documents');

    panelMenu.toggleItem(panelMenu.model()[0]);
    expect(panelMenu.isExpanded(panelMenu.model()[0])).toBeTrue();
  });
});
