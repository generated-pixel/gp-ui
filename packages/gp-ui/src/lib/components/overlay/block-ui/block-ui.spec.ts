import { Component, ElementRef, viewChild, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpBlockUI } from './block-ui';
import { GpBlockUIDirective } from './block-ui.directive';
import { GpBlockUIService } from '../../../services/block-ui.service';

@Component({
  standalone: true,
  imports: [GpBlockUI, GpBlockUIDirective],
  template: `
    <div id="testTarget" #testBox class="box">Target Content</div>
    <div id="directiveTarget" [gpBlockUI]="directiveBlocked()" [blockUIMessage]="'Directive blocking...'">
      Directive Content
    </div>
    <div id="serviceDirectiveTarget" gpBlockUI [blockUIName]="'namedContainer'">Service Directive Content</div>
    <gp-block-ui
      #blockUiComponent
      [blocked]="isBlocked()"
      [target]="target()"
      [message]="message()"
      [blur]="blur()"
      [spinner]="spinner()"
      (onBlocked)="onBlockedHandler()"
      (onUnblocked)="onUnblockedHandler()"
    />
  `
})
class TestHostComponent {
  public testBox = viewChild<ElementRef<HTMLElement>>('testBox');
  public blockUiComponent = viewChild<GpBlockUI>('blockUiComponent');

  public isBlocked = signal<boolean>(false);
  public target = signal<any>(undefined);
  public message = signal<string>('');
  public blur = signal<boolean>(false);
  public spinner = signal<boolean>(true);

  public directiveBlocked = signal<boolean>(false);

  public blockedEmitted = 0;
  public unblockedEmitted = 0;

  public onBlockedHandler(): void {
    this.blockedEmitted++;
  }

  public onUnblockedHandler(): void {
    this.unblockedEmitted++;
  }
}

describe('GpBlockUI & GpBlockUIDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let service: GpBlockUIService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    service = TestBed.inject(GpBlockUIService);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Reset service state
    service.unblock();
    service.unblock('namedContainer');
  });

  it('should create host and block-ui component', () => {
    expect(host).toBeTruthy();
    expect(host.blockUiComponent()).toBeTruthy();
  });

  it('should block document level by default and emit events', async () => {
    expect(host.blockedEmitted).toBe(0);

    host.isBlocked.set(true);
    host.message.set('Please wait...');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.blockedEmitted).toBe(1);
    const overlay = document.querySelector('.gp-block-ui') as HTMLElement;
    expect(overlay).toBeTruthy();
    expect(overlay.classList.contains('gp-block-ui--document')).toBe(true);
    expect(overlay.textContent).toContain('Please wait...');

    // Unblock
    host.isBlocked.set(false);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.unblockedEmitted).toBe(1);
    const unblockedOverlay = document.querySelector('.gp-block-ui');
    expect(unblockedOverlay).toBeNull();
  });

  it('should block a specific target using a CSS selector', async () => {
    host.target.set('#testTarget');
    host.isBlocked.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const targetEl = document.querySelector('#testTarget') as HTMLElement;
    expect(targetEl.classList.contains('gp-block-ui-target')).toBe(true);
    expect(targetEl.getAttribute('aria-busy')).toBe('true');

    const overlay = targetEl.querySelector('.gp-block-ui');
    expect(overlay).toBeTruthy();
    expect(overlay?.classList.contains('gp-block-ui--target')).toBe(true);

    // Unblock
    host.isBlocked.set(false);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(targetEl.classList.contains('gp-block-ui-target')).toBe(false);
    expect(targetEl.getAttribute('aria-busy')).toBeNull();
  });

  it('should block a specific target using an ElementRef', async () => {
    const elRef = host.testBox();
    host.target.set(elRef);
    host.isBlocked.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const targetEl = elRef?.nativeElement as HTMLElement;
    expect(targetEl.getAttribute('aria-busy')).toBe('true');
    expect(targetEl.querySelector('.gp-block-ui')).toBeTruthy();

    host.isBlocked.set(false);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(targetEl.getAttribute('aria-busy')).toBeNull();
  });

  it('should support backdrop blur and custom spinner options', async () => {
    host.isBlocked.set(true);
    host.blur.set(true);
    host.spinner.set(false);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const overlay = document.querySelector('.gp-block-ui') as HTMLElement;
    expect(overlay.classList.contains('gp-block-ui--blur')).toBe(true);
    expect(overlay.querySelector('.gp-progress-spinner')).toBeNull();
  });

  it('should block host element when using [gpBlockUI] directive', async () => {
    const dirContainer = document.querySelector('#directiveTarget') as HTMLElement;
    expect(dirContainer.classList.contains('gp-block-ui-target')).toBe(false);

    host.directiveBlocked.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(dirContainer.classList.contains('gp-block-ui-target')).toBe(true);
    expect(dirContainer.getAttribute('aria-busy')).toBe('true');
    const overlay = dirContainer.querySelector('.gp-block-ui') as HTMLElement;
    expect(overlay).toBeTruthy();
    expect(overlay.textContent).toContain('Directive blocking...');

    host.directiveBlocked.set(false);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(dirContainer.classList.contains('gp-block-ui-target')).toBe(false);
    expect(dirContainer.querySelector('.gp-block-ui')).toBeNull();
  });

  it('should allow directive to be controlled via GpBlockUIService with blockUIName', async () => {
    const namedContainer = document.querySelector('#serviceDirectiveTarget') as HTMLElement;
    expect(namedContainer.classList.contains('gp-block-ui-target')).toBe(false);

    service.block('namedContainer', { message: 'Service blocking target' });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(namedContainer.classList.contains('gp-block-ui-target')).toBe(true);
    expect(namedContainer.getAttribute('aria-busy')).toBe('true');
    const overlay = namedContainer.querySelector('.gp-block-ui') as HTMLElement;
    expect(overlay).toBeTruthy();
    expect(overlay.textContent).toContain('Service blocking target');

    service.unblock('namedContainer');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(namedContainer.classList.contains('gp-block-ui-target')).toBe(false);
    expect(namedContainer.querySelector('.gp-block-ui')).toBeNull();
  });
});
