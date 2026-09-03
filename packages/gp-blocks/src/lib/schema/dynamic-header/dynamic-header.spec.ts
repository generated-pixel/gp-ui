import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDynamicHeader } from './dynamic-header';
import { GpHeaderSchema } from '../schema.types';
import { RouterModule } from '@angular/router';

describe('GpDynamicHeader', () => {
  let component: GpDynamicHeader;
  let fixture: ComponentFixture<GpDynamicHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpDynamicHeader, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(GpDynamicHeader);
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

    const titleEl = fixture.nativeElement.querySelector('.header-title');
    const subtitleEl = fixture.nativeElement.querySelector('.header-subtitle');

    expect(titleEl.textContent).toContain('Dashboard Overview');
    expect(subtitleEl.textContent).toContain('Real-time telemetry');
  });
});
