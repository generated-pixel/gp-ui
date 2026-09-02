import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpPassword } from './password';

describe('GpPassword', () => {
  let component: GpPassword;
  let fixture: ComponentFixture<GpPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpPassword]
    }).compileComponents();

    fixture = TestBed.createComponent(GpPassword);
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
