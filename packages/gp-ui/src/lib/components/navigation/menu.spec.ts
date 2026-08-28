import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GpMenuComponent } from './menu/menu.component';
import { GpMenubarComponent, GpMenubarItem } from './menubar/menubar.component';
import { GpContextMenuComponent } from './context-menu/context-menu.component';
import { GpTieredMenuComponent } from './tiered-menu/tiered-menu.component';
import { GpPanelMenuComponent } from './panel-menu/panel-menu.component';
import { GpMegaMenuComponent, GpMegaMenuItem } from './mega-menu/mega-menu.component';
import { GpSplitButtonComponent, GpMenuItem } from '../button/split-button/split-button.component';
import { GpSpeedDialComponent } from '../button/speed-dial/speed-dial.component';

@Component({
  standalone: true,
  imports: [
    GpMenuComponent,
    GpMenubarComponent,
    GpContextMenuComponent,
    GpTieredMenuComponent,
    GpPanelMenuComponent,
    GpMegaMenuComponent,
    GpSplitButtonComponent,
    GpSpeedDialComponent
  ],
  template: `
    <gp-menu #menu [model]="menuItems" [popup]="true" />
    <gp-menubar #menubar [model]="menubarItems" />
    <gp-context-menu #contextMenu [model]="menuItems" />
    <gp-tiered-menu #tieredMenu [model]="menubarItems" [popup]="true" />
    <gp-panel-menu #panelMenu [model]="menubarItems" />
    <gp-mega-menu #megaMenu [model]="megaMenuItems" />
    <gp-split-button #splitButton label="Save" [model]="menuItems" />
    <gp-speed-dial #speedDial [model]="menuItems" />
  `
})
class TestHostComponent {
  menuItems: GpMenuItem[] = [
    { label: 'Item 1', icon: 'file' },
    { label: 'Item 2', icon: 'edit', disabled: true },
    { separator: true },
    { label: 'Item 3', icon: 'trash' }
  ];

  menubarItems: GpMenubarItem[] = [
    {
      label: 'File',
      icon: 'file',
      items: [
        { label: 'New', icon: 'plus' },
        {
          label: 'Export',
          items: [{ label: 'PDF' }, { label: 'CSV' }]
        }
      ]
    },
    { label: 'Edit', icon: 'edit' }
  ];

  megaMenuItems: GpMegaMenuItem[] = [
    {
      label: 'Products',
      columns: [
        {
          label: 'Category 1',
          items: [{ label: 'Product 1' }]
        }
      ]
    }
  ];
}

describe('Navigation Menu Components', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize all menu components cleanly', () => {
    expect(host).toBeTruthy();
  });

  it('should toggle popup menu visibility on toggle()', () => {
    const menuEl = fixture.nativeElement.querySelector('gp-menu');
    const menuInstance = (fixture.debugElement.children[0].componentInstance) as GpMenuComponent;

    expect(menuInstance.visible()).toBe(false);
    menuInstance.show(new MouseEvent('click'));
    fixture.detectChanges();
    expect(menuInstance.visible()).toBe(true);

    menuInstance.hide();
    fixture.detectChanges();
    expect(menuInstance.visible()).toBe(false);
  });

  it('should position context menu on show(event) with boundary detection', () => {
    const contextInstance = (fixture.debugElement.children[2].componentInstance) as GpContextMenuComponent;

    expect(contextInstance.visible()).toBe(false);
    const fakeEvent = new MouseEvent('contextmenu', { clientX: 100, clientY: 200 });
    contextInstance.show(fakeEvent);
    fixture.detectChanges();

    expect(contextInstance.visible()).toBe(true);
    contextInstance.hide();
    fixture.detectChanges();
    expect(contextInstance.visible()).toBe(false);
  });

  it('should toggle panel menu expansion reactively', () => {
    const panelInstance = (fixture.debugElement.children[4].componentInstance) as GpPanelMenuComponent;
    const firstItem = host.menubarItems[0];

    expect(panelInstance.isExpanded(firstItem)).toBe(false);
    panelInstance.toggle(firstItem);
    fixture.detectChanges();
    expect(panelInstance.isExpanded(firstItem)).toBe(true);

    panelInstance.toggle(firstItem);
    fixture.detectChanges();
    expect(panelInstance.isExpanded(firstItem)).toBe(false);
  });

  it('should handle menubar root item interaction', () => {
    const menubarInstance = (fixture.debugElement.children[1].componentInstance) as GpMenubarComponent;
    const fileItem = host.menubarItems[0];

    menubarInstance.onRootItemClick(fileItem, new MouseEvent('click'));
    fixture.detectChanges();
    expect(menubarInstance.activeItem()).toBe(fileItem);

    menubarInstance.close();
    fixture.detectChanges();
    expect(menubarInstance.activeItem()).toBeNull();
  });
});
