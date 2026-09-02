import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpPasswordComponent } from './password.component';

describe('GpPasswordComponent', () => {
  let component: GpPasswordComponent;
  let fixture: ComponentFixture<GpPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpPasswordComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpPasswordComponent);
    component = fixture.componentInstance;
  });

  it('should create the password component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle mask when mask toggle button is clicked', () => {
    fixture.componentRef.setInput('toggleMask', true);
    fixture.detectChanges();

    const toggleBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.gp-password-toggle-btn');
    expect(toggleBtn).toBeTruthy();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.type).toBe('password');

    toggleBtn.click();
    fixture.detectChanges();

    expect(input.type).toBe('text');
  });
});
