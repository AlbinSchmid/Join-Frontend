import { CdkDrag, CdkDragPreview, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressBarModule, ProgressBarMode} from '@angular/material/progress-bar';
import { CommonEngine } from '@angular/ssr/node';

@Component({
  selector: 'app-task-card',
  imports: [
    MatProgressBarModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  users = ['AA', 'MA', 'SA']
  value = 50;
}
