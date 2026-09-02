import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpMdEditor } from './md-editor';

describe('GpMdEditor', () => {
  let component: GpMdEditor;
  let fixture: ComponentFixture<GpMdEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpMdEditor]
    }).compileComponents();

    fixture = TestBed.createComponent(GpMdEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize cleanly', () => {
    expect(component).toBeTruthy();
    expect(component.viewMode()).toBe('split');
  });

  it('should handle writeValue and render markdown to HTML', () => {
    component.writeValue('# Hello Markdown\n\nThis is **bold** text.');
    expect(component.internalValue()).toBe('# Hello Markdown\n\nThis is **bold** text.');
    expect(component.renderedHtml()).toContain('<h1>Hello Markdown</h1>');
    expect(component.renderedHtml()).toContain('<strong>bold</strong>');
    expect(component.wordCount()).toBe(6);
  });

  it('should render tables properly', () => {
    const tableMd = '| Col 1 | Col 2 |\n| --- | --- |\n| A | B |';
    const html = component.parseMarkdown(tableMd);
    expect(html).toContain('<table class="gp-md-table">');
    expect(html).toContain('<th>Col 1</th>');
    expect(html).toContain('<td>A</td>');
  });

  it('should render task lists properly', () => {
    const taskMd = '- [ ] Todo item\n- [x] Done item';
    const html = component.parseMarkdown(taskMd);
    expect(html).toContain('class="gp-md-task-item"');
    expect(html).toContain('checked');
  });

  it('should toggle view modes correctly', () => {
    component.setViewMode('preview');
    expect(component.viewMode()).toBe('preview');
    component.setViewMode('edit');
    expect(component.viewMode()).toBe('edit');
    component.setViewMode('split');
    expect(component.viewMode()).toBe('split');
  });

  it('should render in readonly mode showing only the preview pane', () => {
    fixture.componentRef.setInput('readonly', true);
    component.writeValue('## Readonly Markdown\n\nContent');
    fixture.detectChanges();
    const toolbar = fixture.nativeElement.querySelector('.gp-md-editor__toolbar');
    expect(toolbar).toBeNull();
    const textarea = fixture.nativeElement.querySelector('.gp-md-editor__textarea');
    expect(textarea).toBeNull();
    const preview = fixture.nativeElement.querySelector('.gp-md-editor__pane--preview');
    expect(preview).not.toBeNull();
    expect(preview.innerHTML).toContain('<h2>Readonly Markdown</h2>');
  });
});
