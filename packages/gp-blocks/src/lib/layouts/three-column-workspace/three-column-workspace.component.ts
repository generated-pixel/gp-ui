import { Component, input, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-three-column-workspace',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './three-column-workspace.component.html',
  styleUrl: './three-column-workspace.component.scss'
})
export class GpLayoutThreeColumnWorkspaceComponent {
  public explorerTitle = input<string>('EXPLORER');
  public activeFileName = input<string>('button.component.ts');

  @Input() public activityBarTemplate?: TemplateRef<any>;
  @Input() public explorerTemplate?: TemplateRef<any>;
  @Input() public editorTemplate?: TemplateRef<any>;

  @ContentChild('activityBar') public contentActivityBar?: TemplateRef<any>;
  @ContentChild('explorer') public contentExplorer?: TemplateRef<any>;
  @ContentChild('editor') public contentEditor?: TemplateRef<any>;

  public get effectiveActivityBar(): TemplateRef<any> | undefined {
    return this.activityBarTemplate || this.contentActivityBar;
  }

  public get effectiveExplorer(): TemplateRef<any> | undefined {
    return this.explorerTemplate || this.contentExplorer;
  }

  public get effectiveEditor(): TemplateRef<any> | undefined {
    return this.editorTemplate || this.contentEditor;
  }
}
