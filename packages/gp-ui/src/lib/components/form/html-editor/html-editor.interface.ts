export type GpHtmlEditorControl =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'subscript'
  | 'superscript'
  | 'heading'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'paragraph'
  | 'blockquote'
  | 'code'
  | 'orderedList'
  | 'unorderedList'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'alignJustify'
  | 'link'
  | 'unlink'
  | 'image'
  | 'color'
  | 'bgColor'
  | 'clear'
  | 'hr'
  | 'source'
  | 'undo'
  | 'redo'
  | '|';

export interface GpHtmlEditorCustomAction {
  id: string;
  label: string;
  icon?: string;
  title?: string;
  command: (editor: any) => void;
}
