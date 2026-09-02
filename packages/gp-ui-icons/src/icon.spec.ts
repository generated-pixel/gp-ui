import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpIcon } from './icon';

describe('GpIcon', () => {
  let component: GpIcon;
  let fixture: ComponentFixture<GpIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpIcon]
    }).compileComponents();

    fixture = TestBed.createComponent(GpIcon);
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
