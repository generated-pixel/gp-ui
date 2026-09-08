import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTag } from './tag';

describe('GpTag', () => {
  let component: GpTag;
  let fixture: ComponentFixture<GpTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpTag]
    }).compileComponents();

    fixture = TestBed.createComponent(GpTag);
    component = fixture.componentInstance;
  });

  it('should create the tag component', () => {
    expect(component).toBeTruthy();
  });

  it('should retain gp-tag base class on inner span', () => {
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('span');
    expect(span.classList).toContain('gp-tag');
  });

  it('should apply size and rounded classes', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.componentRef.setInput('rounded', true);
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span.classList).toContain('gp-tag--sm');
    expect(span.classList).toContain('gp-tag--rounded');
  });
});
