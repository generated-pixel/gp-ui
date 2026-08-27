import { Routes } from '@angular/router';
import { GettingStartedComponent } from './pages/getting-started/getting-started.component';
import { ThemingPageComponent } from './pages/theming/theming.component';
import { I18nPageComponent } from './pages/i18n/i18n.component';
import { ButtonsDemoComponent } from './pages/buttons-demo/buttons-demo.component';
import { FormsDemoComponent } from './pages/forms-demo/forms-demo.component';
import { DataDemoComponent } from './pages/data-demo/data-demo.component';
import { TreeDemoComponent } from './pages/tree-demo/tree-demo.component';
import { NavigationDemoComponent } from './pages/navigation-demo/navigation-demo.component';
import { OverlayDemoComponent } from './pages/overlay-demo/overlay-demo.component';
import { PanelsDemoComponent } from './pages/panels-demo/panels-demo.component';
import { FeedbackDemoComponent } from './pages/feedback-demo/feedback-demo.component';
import { DisplayDemoComponent } from './pages/display-demo/display-demo.component';

export const routes: Routes = [
  { path: '', redirectTo: 'getting-started', pathMatch: 'full' },
  { path: 'docs', redirectTo: 'getting-started', pathMatch: 'full' },
  { path: 'getting-started', component: GettingStartedComponent },
  { path: 'theming', component: ThemingPageComponent },
  { path: 'i18n', component: I18nPageComponent },
  { path: 'buttons', component: ButtonsDemoComponent },
  { path: 'forms', component: FormsDemoComponent },
  { path: 'data', component: DataDemoComponent },
  { path: 'tree', component: TreeDemoComponent },
  { path: 'navigation', component: NavigationDemoComponent },
  { path: 'overlays', component: OverlayDemoComponent },
  { path: 'panels', component: PanelsDemoComponent },
  { path: 'feedback', component: FeedbackDemoComponent },
  { path: 'display', component: DisplayDemoComponent },
  { path: '**', redirectTo: 'getting-started' }
];
