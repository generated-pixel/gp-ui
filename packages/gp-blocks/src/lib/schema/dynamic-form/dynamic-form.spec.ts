import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDynamicForm } from './dynamic-form';
import { GpFormSchema } from '../schema.types';

describe('GpDynamicForm', () => {
  let component: GpDynamicForm;
  let fixture: ComponentFixture<GpDynamicForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpDynamicForm]
    }).compileComponents();

    fixture = TestBed.createComponent(GpDynamicForm);
    component = fixture.componentInstance;
  });

  it('should create the dynamic form component', () => {
    expect(component).toBeTruthy();
  });

  it('should generate form controls from schema and submit value', () => {
    const schema: GpFormSchema = {
      id: 'test-form',
      fields: [
        { name: 'username', label: 'Username', type: 'text', defaultValue: 'admin' },
        { name: 'active', label: 'Active', type: 'switch', defaultValue: true }
      ],
      submitButton: { id: 'submit', label: 'Submit' }
    };

    let submittedData: any = null;
    component.formSubmit.subscribe((data) => (submittedData = data));

    fixture.componentRef.setInput('schema', schema);
    fixture.detectChanges();

    expect(component.form.get('username')?.value).toBe('admin');
    expect(component.form.get('active')?.value).toBe(true);

    component.onSubmit();
    expect(submittedData).toEqual({ username: 'admin', active: true });
  });
});
