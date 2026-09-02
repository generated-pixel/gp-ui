export type GpMdEditorViewMode = 'split' | 'edit' | 'preview';

export type GpMdEditorControl =
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bold'
  | 'italic'
  | 'strike'
  | 'quote'
  | 'code'
  | 'codeBlock'
  | 'unorderedList'
  | 'orderedList'
  | 'taskList'
  | 'link'
  | 'image'
  | 'table'
  | 'hr'
  | 'undo'
  | 'redo'
  | '|';

export interface GpMdEditorCustomAction {
  id: string;
  label: string;
  icon?: string;
  title?: string;
  command: (editor: any) => void;
}
