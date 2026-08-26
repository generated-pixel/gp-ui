import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  GpButtonComponent,
  GpTagComponent,
  GpInputTextComponent,
  GpProgressBarComponent,
  GpSwitchComponent,
  GpBadgeComponent,
  GP_UI_VERSION
} from 'gp-ui';
import { GpIconComponent } from 'gp-ui-icons';

export interface WebsiteProject {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  url: string;
  visitText: string;
  isInternal?: boolean;
}

export interface WebsiteService {
  id: string;
  title: string;
  description: string;
  chips: string[];
}

@Component({
  selector: 'app-website-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    GpButtonComponent,
    GpTagComponent,
    GpInputTextComponent,
    GpProgressBarComponent,
    GpSwitchComponent,
    GpBadgeComponent,
    GpIconComponent
  ],
  templateUrl: './website-home.component.html',
  styleUrls: ['./website-home.component.scss']
})
export class WebsiteHomeComponent {
  protected readonly version = GP_UI_VERSION;
  services: WebsiteService[] = [
    {
      id: 'frontend',
      title: 'Frontend Development',
      description: 'Build responsive, performant web applications with TypeScript, modern Angular architecture, and accessible UI frameworks.',
      chips: ['Frontend Architecture', 'Angular 22', 'TypeScript', 'Design Systems']
    },
    {
      id: 'backend',
      title: 'Backend Development',
      description: 'Create robust, high-throughput ASP.NET Core APIs and cloud services with clean architecture and Entity Framework.',
      chips: ['ASP.NET Core', 'C# / .NET 9', 'Entity Framework', 'REST / gRPC APIs']
    },
    {
      id: 'fullstack',
      title: 'Full-Stack Solutions',
      description: 'Complete end-to-end applications from cloud database infrastructure to interactive browser client, fully tested and deployed.',
      chips: ['End-to-End Delivery', 'CI/CD Pipelines', 'Cloud Architecture', 'Automated Testing']
    }
  ];

  projects: WebsiteProject[] = [
    {
      id: 'gp-ui',
      title: '@generatedpixel/gp-ui',
      eyebrow: 'Open Source Framework',
      description: 'Enterprise Angular UI component framework featuring 40+ standalone components, design tokens, full accessibility, and CVA reactive forms.',
      url: '/getting-started',
      visitText: 'Explore Docs & Demo',
      isInternal: true
    },
    {
      id: 'figure-model',
      title: 'Figure-Model.Art',
      eyebrow: 'Featured Project',
      description: 'One of our developers is also a figure model, check their creative portfolio out here!',
      url: 'https://figure-model.art/',
      visitText: 'Visit Figure Model'
    },
    {
      id: 'guid-studio',
      title: 'guid.studio',
      eyebrow: 'Featured Project',
      description: 'A handy web utility that formats, inspects, and converts UUIDs and GUIDs across different platform representations.',
      url: 'https://guid.studio/',
      visitText: 'Visit guid.studio'
    }
  ];
}
