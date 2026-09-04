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
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { GpEditableBase } from '../../../base/gp-editable-base';
import { GpIcon } from '../../../icons/icon';
import { UniqueId } from '../../../utils/unique-id';
import { GpMdEditorControl, GpMdEditorCustomAction, GpMdEditorViewMode } from './md-editor.interface';

const DEFAULT_MD_CONTROLS: GpMdEditorControl[] = [
  'heading1',
  'heading2',
  'heading3',
  '|',
  'bold',
  'italic',
  'strike',
  '|',
  'quote',
  'code',
  'codeBlock',
  '|',
  'unorderedList',
  'orderedList',
  'taskList',
  '|',
  'link',
  'image',
  'table',
  'hr'
];

@Component({
  selector: 'gp-md-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpMdEditor),
      multi: true
    }
  ],
  templateUrl: './md-editor.html',
  styleUrl: './md-editor.scss'
})
export class GpMdEditor extends GpEditableBase<string> implements ControlValueAccessor {
  @ViewChild('textareaRef') textareaRef?: ElementRef<HTMLTextAreaElement>;

  public controls = input<GpMdEditorControl[]>(DEFAULT_MD_CONTROLS);
  public customActions = input<GpMdEditorCustomAction[]>([]);
  public viewMode = signal<GpMdEditorViewMode>('split');
  public height = input<string>('320px');
  public showStatusBar = input<boolean>(true);
  public showLineNumbers = input<boolean>(false);

  public onMarkdownChange = output<string>();
  public onViewModeChange = output<GpMdEditorViewMode>();

  public isFocused = signal<boolean>(false);

  public characterCount = computed(() => (this.internalValue() || '').length);

  public wordCount = computed(() => {
    const raw = (this.internalValue() || '').trim();
    if (!raw) {
      return 0;
    }
    const clean = raw.replace(/^#+\s+/gm, '').replace(/[*_~`]/g, '');
    return clean.split(/\s+/).filter(Boolean).length;
  });

  public lineCount = computed(() => {
    const text = this.internalValue() || '';
    if (!text) {
      return 1;
    }
    return text.split('\n').length;
  });

  public renderedHtml = computed(() => {
    return this.parseMarkdown(this.internalValue() || '');
  });

  constructor(private el: ElementRef) {
    super();
    this.defaultInputId.set(UniqueId.generate('gp_mdeditor_'));
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
  }

  public onInput(event: Event): void {
    const val = (event.target as HTMLTextAreaElement).value;
    this.updateValue(val);
    this.onMarkdownChange.emit(val);
  }

  public setViewMode(mode: GpMdEditorViewMode): void {
    this.viewMode.set(mode);
    this.onViewModeChange.emit(mode);
  }

  public insertFormatting(type: GpMdEditorControl): void {
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }

    const textarea = this.textareaRef?.nativeElement;
    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;

    switch (type) {
      case 'heading1':
        replacement = `# ${selectedText || 'Heading 1'}`;
        break;
      case 'heading2':
        replacement = `## ${selectedText || 'Heading 2'}`;
        break;
      case 'heading3':
        replacement = `### ${selectedText || 'Heading 3'}`;
        break;
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        cursorOffset = selectedText ? replacement.length : 2;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        cursorOffset = selectedText ? replacement.length : 1;
        break;
      case 'strike':
        replacement = `~~${selectedText || 'strikethrough'}~~`;
        cursorOffset = selectedText ? replacement.length : 2;
        break;
      case 'quote':
        replacement = `> ${selectedText || 'Quote text'}\n`;
        break;
      case 'code':
        replacement = `\`${selectedText || 'code'}\``;
        cursorOffset = selectedText ? replacement.length : 1;
        break;
      case 'codeBlock':
        replacement = `\`\`\`typescript\n${selectedText || '// Code here'}\n\`\`\`\n`;
        break;
      case 'unorderedList':
        replacement = selectedText
          ? selectedText
              .split('\n')
              .map((l) => `- ${l}`)
              .join('\n')
          : '- List item\n';
        break;
      case 'orderedList':
        replacement = selectedText
          ? selectedText
              .split('\n')
              .map((l, i) => `${i + 1}. ${l}`)
              .join('\n')
          : '1. List item\n';
        break;
      case 'taskList':
        replacement = selectedText
          ? selectedText
              .split('\n')
              .map((l) => `- [ ] ${l}`)
              .join('\n')
          : '- [ ] Task item\n';
        break;
      case 'link':
        replacement = `[${selectedText || 'link text'}](https://example.com)`;
        break;
      case 'image':
        replacement = `![${selectedText || 'alt text'}](https://example.com/image.png)`;
        break;
      case 'table':
        replacement = '| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Data 1 | Data 2 | Data 3 |\n';
        break;
      case 'hr':
        replacement = '\n---\n';
        break;
      default:
        return;
    }

    const newText = text.substring(0, start) + replacement + text.substring(end);
    this.updateValue(newText);
    this.onMarkdownChange.emit(newText);

    setTimeout(() => {
      textarea.focus();
      const pos = start + (cursorOffset || replacement.length);
      textarea.setSelectionRange(pos, pos);
    });
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (this.isEffectivelyDisabled() || this.readonly()) {
      return;
    }

    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'b' || event.key === 'B') {
        event.preventDefault();
        this.insertFormatting('bold');
      } else if (event.key === 'i' || event.key === 'I') {
        event.preventDefault();
        this.insertFormatting('italic');
      } else if (event.key === 'k' || event.key === 'K') {
        event.preventDefault();
        this.insertFormatting('link');
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = this.textareaRef?.nativeElement;
      if (!textarea) {
        return;
      }
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const newText = text.substring(0, start) + '  ' + text.substring(end);
      this.updateValue(newText);
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      });
    }
  }

  /**
   * Safe, zero-dependency Markdown parser converting GFM to sanitized HTML.
   */
  public parseMarkdown(md: string): string {
    if (!md) {
      return '';
    }

    // 1. Sanitize raw HTML tags to prevent XSS
    let html = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // 2. Fenced Code Blocks (```lang ... ```)
    html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const langBadge = lang ? `<div class="gp-md-code-lang">${lang}</div>` : '';
      return `<div class="gp-md-code-block">${langBadge}<pre><code>${code.trim()}</code></pre></div>`;
    });

    // 3. Inline Code (`code`)
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 4. Tables
    html = html.replace(/(?:\|[^\n]+\|(?:\r?\n|$))+/g, (tableMatch) => {
      const rows = tableMatch
        .trim()
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);
      if (rows.length < 2) {
        return tableMatch;
      }

      let tableHtml = '<table class="gp-md-table">';
      let isHeader = true;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (/^\|[\s-:]+\|\s*$/.test(row) || /^\|(?:\s*:?-+:?\s*\|)+$/.test(row)) {
          // Divider row
          isHeader = false;
          continue;
        }

        const cells = row
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((c) => c.trim());

        const tag = isHeader ? 'th' : 'td';
        tableHtml += '<tr>';
        for (const cell of cells) {
          tableHtml += `<${tag}>${cell}</${tag}>`;
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</table>';
      return tableHtml;
    });

    // 5. Blockquotes (> quote)
    html = html.replace(/^(&gt;|>)\s?(.*)$/gm, '<blockquote>$2</blockquote>');

    // 6. Headers (# Heading)
    html = html.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>');
    html = html.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>');
    html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');

    // 7. Horizontal Rules
    html = html.replace(/^(?:---|\*\*\*|___)\s*$/gm, '<hr />');

    // 8. Task Lists (- [ ] / - [x])
    html = html.replace(
      /^-\s+\[ \]\s+(.*)$/gm,
      '<div class="gp-md-task-item"><input type="checkbox" disabled /> <span>$1</span></div>'
    );
    html = html.replace(
      /^-\s+\[[xX]\]\s+(.*)$/gm,
      '<div class="gp-md-task-item"><input type="checkbox" checked disabled /> <span>$1</span></div>'
    );

    // 9. Unordered Lists (- item / * item)
    html = html.replace(/^[\*\-]\s+(.*)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // 10. Ordered Lists (1. item)
    html = html.replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>');

    // 11. Bold, Italic, Strikethrough
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
    html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

    // 12. Images (![alt](url))
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="gp-md-image" />');

    // 13. Links ([text](url))
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="gp-md-link">$1</a>'
    );

    // 14. Paragraphs and Line Breaks
    html = html
      .split(/\n{2,}/)
      .map((block) => {
        if (/^<(h[1-6]|ul|ol|blockquote|table|div|hr|pre)/.test(block.trim())) {
          return block;
        }
        return `<p>${block.replace(/\n/g, '<br />')}</p>`;
      })
      .join('\n');

    return html;
  }
}
