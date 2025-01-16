import { CdkDrag, CdkDragPreview, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressBarModule, ProgressBarMode} from '@angular/material/progress-bar';
import { TaskInterface } from '../../../shared/interfaces/task-interface';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { log } from 'node:console';

@Component({
  selector: 'app-task-card',
  imports: [
    MatProgressBarModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  standalone: true
})
export class TaskCardComponent {
  dashboardService = inject(DashboardService)
  users = ['AA', 'MA', 'SA']
  value = 0;

  subtaskValue = 0;
  @Input() task: TaskInterface;
  @Input() contacts: any[] = [];
  @Input() subtasks: any[] = [{title: 'Subtask 1'}, {title: 'Subtask 2'}];

  ngOnInit() {
    if (this.subtasks) {
      this.subtaskValue = this.subtasks.length
    }
  }

  controllPrio():string {
    if (this.task.prio === 'high') {
      return 'keyboard_double_arrow_up';
    } else if (this.task.prio === 'medium') {
      return 'drag_handle';
    } else {
      return 'keyboard_double_arrow_down';
    }
  }

}
