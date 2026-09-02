import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpFileUpload } from './file-upload';

describe('GpFileUpload', () => {
  let component: GpFileUpload;
  let fixture: ComponentFixture<GpFileUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpFileUpload]
    }).compileComponents();

    fixture = TestBed.createComponent(GpFileUpload);
    component = fixture.componentInstance;
  });

  it('should create the file upload component', () => {
    expect(component).toBeTruthy();
  });
});
