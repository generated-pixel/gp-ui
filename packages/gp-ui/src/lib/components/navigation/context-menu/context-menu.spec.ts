import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpContextMenu } from './context-menu';
import { Component } from '@angular/core';
import { GpMenuItem } from '../../button/split-button/split-button';
import { provideRouter } from '@angular/router';

@Component({
  standalone: true,
  imports: [GpContextMenu],
  template: ' <gp-context-menu [model]="items" #cm /> '
})
class TestHostComponent {
  items: GpMenuItem[] = [
    { label: 'Copy', icon: 'copy' },
    { label: 'Paste', icon: 'clipboard' }
  ];
}

describe('GpContextMenu', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpContextMenu],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should instantiate context menu component', () => {
    const cm = fixture.debugElement.children[0].componentInstance as GpContextMenu;
    expect(cm).toBeTruthy();
    expect(cm.visible()).toBeFalse();
  });
});
