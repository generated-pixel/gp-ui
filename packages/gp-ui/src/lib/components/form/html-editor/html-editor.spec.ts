import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpHtmlEditor } from './html-editor';

describe('GpHtmlEditor', () => {
  let component: GpHtmlEditor;
  let fixture: ComponentFixture<GpHtmlEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpHtmlEditor]
    }).compileComponents();

    fixture = TestBed.createComponent(GpHtmlEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize cleanly', () => {
    expect(component).toBeTruthy();
    expect(component.isSourceMode()).toBeFalse();
  });

  it('should handle writeValue and update internalValue signal', () => {
    component.writeValue('<p>Hello World</p>');
    expect(component.internalValue()).toBe('<p>Hello World</p>');
    expect(component.wordCount()).toBe(2);
    expect(component.characterCount()).toBe(11);
  });

  it('should toggle source mode correctly', () => {
    expect(component.isSourceMode()).toBeFalse();
    component.toggleSourceMode();
    expect(component.isSourceMode()).toBeTrue();
    component.toggleSourceMode();
    expect(component.isSourceMode()).toBeFalse();
  });

  it('should compute word and character counts from stripped html', () => {
    component.writeValue('<h1>Title</h1><p>This is a test.</p>');
    expect(component.wordCount()).toBe(5);
  });

  it('should render in readonly mode without toolbar', () => {
    fixture.componentRef.setInput('readonly', true);
    component.writeValue('<p>Read only text</p>');
    fixture.detectChanges();
    const toolbar = fixture.nativeElement.querySelector('.gp-html-editor__toolbar');
    expect(toolbar).toBeNull();
    const content = fixture.nativeElement.querySelector('.gp-html-editor__content');
    expect(content.getAttribute('contenteditable')).toBe('false');
  });
});
