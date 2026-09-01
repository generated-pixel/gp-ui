import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDynamicStatsComponent } from './dynamic-stats.component';
import { GpStatsSchema } from '../schema.types';

describe('GpDynamicStatsComponent', () => {
  let component: GpDynamicStatsComponent;
  let fixture: ComponentFixture<GpDynamicStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpDynamicStatsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpDynamicStatsComponent);
    component = fixture.componentInstance;
  });

  it('should create the dynamic stats component', () => {
    expect(component).toBeTruthy();
  });

  it('should render stat cards from schema', () => {
    const schema: GpStatsSchema = {
      items: [
        { id: 'revenue', label: 'Total Revenue', value: '$45,000', change: '+12%' }
      ]
    };

    fixture.componentRef.setInput('schema', schema);
    fixture.detectChanges();

    const statCard = fixture.nativeElement.querySelector('.gp-dyn-stat-card');
    expect(statCard).toBeTruthy();
    expect(statCard.textContent).toContain('Total Revenue');
    expect(statCard.textContent).toContain('$45,000');
  });
});
