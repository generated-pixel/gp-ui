import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpAutocompleteComponent } from './autocomplete.component';

describe('GpAutocompleteComponent', () => {
  let component: GpAutocompleteComponent;
  let fixture: ComponentFixture<GpAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpAutocompleteComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpAutocompleteComponent);
    component = fixture.componentInstance;
  });

  it('should create the autocomplete component', () => {
    expect(component).toBeTruthy();
  });
});
