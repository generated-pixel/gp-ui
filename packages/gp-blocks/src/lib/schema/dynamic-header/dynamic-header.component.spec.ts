import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDynamicHeaderComponent } from './dynamic-header.component';
import { GpHeaderSchema } from '../schema.types';
import { RouterModule } from '@angular/router';

describe('GpDynamicHeaderComponent', () => {
  let component: GpDynamicHeaderComponent;
  let fixture: ComponentFixture<GpDynamicHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpDynamicHeaderComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(GpDynamicHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create the dynamic header component', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and subtitle from schema', () => {
    const schema: GpHeaderSchema = {
      title: 'Dashboard Overview',
      subtitle: 'Real-time telemetry'
    };

    fixture.componentRef.setInput('schema', schema);
    fixture.detectChanges();

    const titleEl = fixture.nativeElement.querySelector('.gp-dyn-header-title');
    const subtitleEl = fixture.nativeElement.querySelector('.gp-dyn-header-subtitle');

    expect(titleEl.textContent).toContain('Dashboard Overview');
    expect(subtitleEl.textContent).toContain('Real-time telemetry');
  });
});
