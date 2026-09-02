import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpBreadcrumb } from './breadcrumb';
import { RouterModule } from '@angular/router';

describe('GpBreadcrumb', () => {
  let component: GpBreadcrumb;
  let fixture: ComponentFixture<GpBreadcrumb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpBreadcrumb, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(GpBreadcrumb);
    component = fixture.componentInstance;
  });

  it('should create the breadcrumb component', () => {
    expect(component).toBeTruthy();
  });
});
