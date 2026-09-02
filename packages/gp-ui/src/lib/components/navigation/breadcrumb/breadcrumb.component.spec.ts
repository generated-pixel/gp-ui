import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpBreadcrumbComponent } from './breadcrumb.component';
import { RouterModule } from '@angular/router';

describe('GpBreadcrumbComponent', () => {
  let component: GpBreadcrumbComponent;
  let fixture: ComponentFixture<GpBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpBreadcrumbComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(GpBreadcrumbComponent);
    component = fixture.componentInstance;
  });

  it('should create the breadcrumb component', () => {
    expect(component).toBeTruthy();
  });
});
