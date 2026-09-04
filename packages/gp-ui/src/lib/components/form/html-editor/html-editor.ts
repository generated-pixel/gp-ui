import {
  Component,
  input,
  output,
  signal,
  computed,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  forwardRef,
  ElementRef,
  ViewChild,
  HostListener,
  inject
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpEditableBase } from '../../../base/gp-editable-base';
import { GpIcon } from '../../../icons/icon';
import { UniqueId } from '../../../utils/unique-id';
import { GpHtmlEditorControl, GpHtmlEditorCustomAction } from './html-editor.interface';

const DEFAULT_CONTROLS: GpHtmlEditorControl[] = [
  'undo',
  'redo',
  '|',
  'heading',
  '|',
  'bold',
  'italic',
  'underline',
  'strike',
  '|',
  'color',
  'bgColor',
  '|',
  'alignLeft',
  'alignCenter',
  'alignRight',
  'alignJustify',
  '|',
  'unorderedList',
  'orderedList',
  'blockquote',
  'code',
  '|',
  'link',
  'image',
  'hr',
  'clear',
  '|',
  'source'
];

@Component({
  selector: 'gp-html-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpHtmlEditor),
      multi: true
    }
  ],
  templateUrl: './html-editor.html',
  styleUrl: './html-editor.scss'
})
export class GpHtmlEditor extends GpEditableBase<string> implements ControlValueAccessor {
  @ViewChild('contentArea') contentAreaRef?: ElementRef<HTMLDivElement>;
  @ViewChild('sourceTextarea') sourceTextareaRef?: ElementRef<HTMLTextAreaElement>;

  public controls = input<GpHtmlEditorControl[]>(DEFAULT_CONTROLS);
  public customActions = input<GpHtmlEditorCustomAction[]>([]);
  public height = input<string>('240px');
  public showStatusBar = input<boolean>(true);

  public onHtmlChange = output<string>();
  public onTextSelect = output<Selection | null>();

  public isSourceMode = signal<boolean>(false);
  public isFocused = signal<boolean>(false);
  public activeFormats = signal<Record<string, boolean>>({});

  // Link Dialog State
  public showLinkModal = signal<boolean>(false);
  public linkUrl = signal<string>('');
  public linkText = signal<string>('');
  private savedSelectionRange: Range | null = null;

  // Image Dialog State
  public showImageModal = signal<boolean>(false);
  public imageUrl = signal<string>('');
  public imageAlt = signal<string>('');

  // Color Pickers State
  public showColorPicker = signal<boolean>(false);
  public showBgColorPicker = signal<boolean>(false);

  public characterCount = computed(() => {
    const html = this.internalValue() || '';
    const text = this.stripHtml(html).trim();
    return text.length;
  });

  public wordCount = computed(() => {
    const html = this.internalValue() || '';
    const text = this.stripHtml(html).trim();
    if (!text) {
      return 0;
    }
    return text.split(/\s+/).filter(Boolean).length;
  });

  private document = inject(DOCUMENT);

  constructor(private el: ElementRef) {
    super();
    this.defaultInputId.set(UniqueId.generate('gp_htmleditor_'));
  }

  public override onInit(): void {
    super.onInit();
    if (this.internalValue() === null || this.internalValue() === undefined) {
      this.internalValue.set('');
    }
  }

  public override writeValue(value: any): void {
    const val = value != null ? String(value) : '';
    this.internalValue.set(val);
    if (this.contentAreaRef?.nativeElement) {
      this.contentAreaRef.nativeElement.innerHTML = val;
    }
  }

  public onContentInput(event: Event): void {
    const target = event.target as HTMLDivElement;
    const html = target.innerHTML;
    this.updateValue(html);
    this.onHtmlChange.emit(html);
    this.checkActiveFormats();
  }

  public onSourceInput(newVal: string): void {
    this.updateValue(newVal);
    this.onHtmlChange.emit(newVal);
    if (this.contentAreaRef?.nativeElement) {
      this.contentAreaRef.nativeElement.innerHTML = newVal;
    }
  }

  public onEditorFocus(): void {
    this.isFocused.set(true);
  }

  public onEditorBlur(): void {
    this.isFocused.set(false);
    this.handleControlBlur();
  }

  public exec(command: string, value: string | undefined = undefined): void {
    if (this.isEffectivelyDisabled() || this.readonly() || this.isSourceMode()) {
      return;
    }
    this.restoreSelection();
    this.contentAreaRef?.nativeElement.focus();

    this.document.execCommand(command, false, value);
    this.syncContent();
    this.checkActiveFormats();
  }

  public setHeading(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const format = target.value;
    if (format === 'p') {
      this.exec('formatBlock', '<p>');
    } else if (format === 'blockquote') {
      this.exec('formatBlock', '<blockquote>');
    } else if (format === 'pre') {
      this.exec('formatBlock', '<pre>');
    } else if (format) {
      this.exec('formatBlock', `<${format}>`);
    }
  }

  public openLinkModal(): void {
    this.saveSelection();
    const sel = this.document.getSelection();
    this.linkText.set(sel ? sel.toString() : '');
    this.linkUrl.set('https://');
    this.showLinkModal.set(true);
  }

  public insertLink(): void {
    const url = this.linkUrl();
    if (url) {
      this.restoreSelection();
      this.exec('createLink', url);
    }
    this.showLinkModal.set(false);
  }

  public openImageModal(): void {
    this.saveSelection();
    this.imageUrl.set('');
    this.imageAlt.set('');
    this.showImageModal.set(true);
  }

  public insertImage(): void {
    const url = this.imageUrl();
    if (url) {
      this.restoreSelection();
      this.exec('insertImage', url);
    }
    this.showImageModal.set(false);
  }

  public setTextColor(color: string): void {
    this.exec('foreColor', color);
    this.showColorPicker.set(false);
  }

  public setBgColor(color: string): void {
    this.exec('hiliteColor', color);
    this.showBgColorPicker.set(false);
  }

  public clearFormatting(): void {
    this.exec('removeFormat');
  }

  public toggleSourceMode(): void {
    const next = !this.isSourceMode();
    this.isSourceMode.set(next);
    if (!next && this.contentAreaRef?.nativeElement) {
      this.contentAreaRef.nativeElement.innerHTML = this.internalValue() || '';
    }
  }

  public checkActiveFormats(): void {
    if (this.isSourceMode()) {
      return;
    }
    try {
      this.activeFormats.set({
        bold: this.document.queryCommandState('bold'),
        italic: this.document.queryCommandState('italic'),
        underline: this.document.queryCommandState('underline'),
        strike: this.document.queryCommandState('strikeThrough'),
        subscript: this.document.queryCommandState('subscript'),
        superscript: this.document.queryCommandState('superscript'),
        orderedList: this.document.queryCommandState('insertOrderedList'),
        unorderedList: this.document.queryCommandState('insertUnorderedList'),
        justifyLeft: this.document.queryCommandState('justifyLeft'),
        justifyCenter: this.document.queryCommandState('justifyCenter'),
        justifyRight: this.document.queryCommandState('justifyRight'),
        justifyFull: this.document.queryCommandState('justifyFull')
      });
    } catch (_) {}
  }

  @HostListener('document:selectionchange')
  onSelectionChange(): void {
    if (this.isFocused()) {
      this.checkActiveFormats();
      const sel = this.document.getSelection();
      this.onTextSelect.emit(sel);
    }
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'b' || event.key === 'B') {
        event.preventDefault();
        this.exec('bold');
      } else if (event.key === 'i' || event.key === 'I') {
        event.preventDefault();
        this.exec('italic');
      } else if (event.key === 'u' || event.key === 'U') {
        event.preventDefault();
        this.exec('underline');
      } else if (event.key === 'z' || event.key === 'Z') {
        if (event.shiftKey) {
          event.preventDefault();
          this.exec('redo');
        } else {
          event.preventDefault();
          this.exec('undo');
        }
      } else if (event.key === 'y' || event.key === 'Y') {
        event.preventDefault();
        this.exec('redo');
      } else if (event.key === 'k' || event.key === 'K') {
        event.preventDefault();
        this.openLinkModal();
      }
    }
  }

  private saveSelection(): void {
    const sel = this.document.getSelection();
    if (sel && sel.rangeCount > 0) {
      this.savedSelectionRange = sel.getRangeAt(0).cloneRange();
    }
  }

  private restoreSelection(): void {
    if (this.savedSelectionRange) {
      const sel = this.document.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(this.savedSelectionRange);
      }
    }
  }

  private syncContent(): void {
    if (this.contentAreaRef?.nativeElement) {
      const html = this.contentAreaRef.nativeElement.innerHTML;
      this.updateValue(html);
      this.onHtmlChange.emit(html);
    }
  }

  private stripHtml(html: string): string {
    const formatted = html.replace(/<\/(p|div|h[1-6]|li|blockquote|tr)>/gi, ' ');
    const tmp = this.document.createElement('div');
    tmp.innerHTML = formatted;
    return tmp.textContent || tmp.innerText || '';
  }
}
