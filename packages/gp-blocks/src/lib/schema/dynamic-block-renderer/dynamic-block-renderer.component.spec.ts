import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDynamicBlockRendererComponent } from './dynamic-block-renderer.component';
import { GpBlockMetadata } from '../schema.types';
import { RouterModule } from '@angular/router';

describe('GpDynamicBlockRendererComponent', () => {
  let component: GpDynamicBlockRendererComponent;
  let fixture: ComponentFixture<GpDynamicBlockRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpDynamicBlockRendererComponent, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(GpDynamicBlockRendererComponent);
    component = fixture.componentInstance;
  });

  it('should create the dynamic block renderer', () => {
    expect(component).toBeTruthy();
  });

  it('should render header and form from block metadata', () => {
    const metadata: GpBlockMetadata = {
      id: 'test-block',
      header: { title: 'Test Block Header' },
      form: {
        id: 'test-f',
        fields: [{ name: 'name', type: 'text', label: 'Full Name' }]
      }
    };

    fixture.componentRef.setInput('metadata', metadata);
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('gp-dynamic-header');
    const form = fixture.nativeElement.querySelector('gp-dynamic-form');

    expect(header).toBeTruthy();
    expect(form).toBeTruthy();
  });
});
