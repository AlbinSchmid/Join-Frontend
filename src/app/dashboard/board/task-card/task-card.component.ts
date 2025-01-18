import { CdkDrag, CdkDragPreview, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';
import { TaskInterface } from '../../../shared/interfaces/task-interface';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { log } from 'node:console';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailDialogComponent } from '../task-detail-dialog/task-detail-dialog.component';
import { ApiService } from '../../../shared/services/api.service';

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
  apiService = inject(ApiService)
  dashboardService = inject(DashboardService)
  dialog = inject(MatDialog);

  @Input() task: TaskInterface;
  @Input() contacts: any[] = [];
  @Input() subtasks: any[] = [];

  progressbarValue = 0;
  subtaskValue = 0;
  completeSubtasksValue = 0;


  ngOnInit() {
    if (this.subtasks) {
      this.subtaskValue = this.subtasks.length;
      this.calculateProgress();
    }
  }


  /**
   * Calculates the progress of a task by summing up the number of completed
   * subtasks and dividing by the total number of subtasks.
   * The progress is then used to set the progressbarValue.
   */
  calculateProgress() {
    this.completeSubtasksValue = this.subtasks.filter((subtask) => subtask.completed).length;
    let value = 100 / this.subtasks.length;
    this.progressbarValue = value * this.completeSubtasksValue;
  }


  /**
   * Opens a dialog window with the task details.
   *
   * @param task The task whose details are to be displayed.
   */
  openTaskDetailDialog(task: TaskInterface,): void {
    this.dialog.open(TaskDetailDialogComponent, {
      data: {
        task
      },
    }).afterClosed().subscribe(result => {
      this.apiService.getTaskData();
    })
  }

}
