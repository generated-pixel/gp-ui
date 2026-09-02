import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpToast } from './toast';
import { GpToastService } from '../../../services/toast.service';

describe('GpToast', () => {
  let fixture: ComponentFixture<GpToast>;
  let toastComponent: GpToast;
  let toastService: GpToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpToast],
      providers: [GpToastService]
    }).compileComponents();

    fixture = TestBed.createComponent(GpToast);
    toastComponent = fixture.componentInstance;
    toastService = TestBed.inject(GpToastService);
    fixture.detectChanges();
  });

  it('should receive messages from toastService and display them', () => {
    toastService.add({
      severity: 'success',
      summary: 'Success Message',
      detail: 'Operation completed successfully.'
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Success Message');
    expect(fixture.nativeElement.textContent).toContain('Operation completed successfully.');
  });
});
