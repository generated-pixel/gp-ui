import {
  Component,
  input,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButton, GpIcon } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-three-column-workspace',
  standalone: true,
  imports: [CommonModule, GpButton, GpIcon],
  templateUrl: './three-column-workspace.html',
  styleUrl: './three-column-workspace.scss'
})
export class GpLayoutThreeColumnWorkspace {
  public explorerTitle = input<string>('EXPLORER');
  public activeFileName = input<string>('button.component.ts');

  public activityBarTemplate = input<TemplateRef<any> | undefined>(undefined);
  public explorerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public editorTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentActivityBar = contentChild<TemplateRef<any>>('activityBar');
  public contentExplorer = contentChild<TemplateRef<any>>('explorer');
  public contentEditor = contentChild<TemplateRef<any>>('editor');

  public effectiveActivityBar = computed(() => this.activityBarTemplate() || this.contentActivityBar());

  public effectiveExplorer = computed(() => this.explorerTemplate() || this.contentExplorer());

  public effectiveEditor = computed(() => this.editorTemplate() || this.contentEditor());
}
