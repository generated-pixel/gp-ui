import { Component } from '@angular/core';
import { DashboardDesigner } from 'gp-analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardDesigner],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {}
