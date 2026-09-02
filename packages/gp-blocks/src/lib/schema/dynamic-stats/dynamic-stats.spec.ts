import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDynamicStats } from './dynamic-stats';
import { GpStatsSchema } from '../schema.types';

describe('GpDynamicStats', () => {
  let component: GpDynamicStats;
  let fixture: ComponentFixture<GpDynamicStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpDynamicStats]
    }).compileComponents();

    fixture = TestBed.createComponent(GpDynamicStats);
    component = fixture.componentInstance;
  });

  it('should create the dynamic stats component', () => {
    expect(component).toBeTruthy();
  });

  it('should render stat cards from schema', () => {
    const schema: GpStatsSchema = {
      items: [{ id: 'revenue', label: 'Total Revenue', value: '$45,000', change: '+12%' }]
    };

    fixture.componentRef.setInput('schema', schema);
    fixture.detectChanges();

    const statCard = fixture.nativeElement.querySelector('.gp-dyn-stat-card');
    expect(statCard).toBeTruthy();
    expect(statCard.textContent).toContain('Total Revenue');
    expect(statCard.textContent).toContain('$45,000');
  });
});
