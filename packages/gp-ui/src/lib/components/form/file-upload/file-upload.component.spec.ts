import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpFileUploadComponent } from './file-upload.component';

describe('GpFileUploadComponent', () => {
  let component: GpFileUploadComponent;
  let fixture: ComponentFixture<GpFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpFileUploadComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpFileUploadComponent);
    component = fixture.componentInstance;
  });

  it('should create the file upload component', () => {
    expect(component).toBeTruthy();
  });
});
