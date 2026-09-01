import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpIconComponent } from './icon.component';

describe('GpIconComponent', () => {
  let component: GpIconComponent;
  let fixture: ComponentFixture<GpIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpIconComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpIconComponent);
    component = fixture.componentInstance;
  });

  it('should create the icon component', () => {
    expect(component).toBeTruthy();
  });

  it('should render check icon path', () => {
    fixture.componentRef.setInput('name', 'check');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
  });
});
