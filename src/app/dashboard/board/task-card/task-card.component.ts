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

  windowWidth: number = window.innerWidth;

  progressbarValue = 0;
  subtaskValue = 0;
  completeSubtasksValue = 0;


  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * Initializes the subtask value and calculates the progress if subtasks are present.
   */
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
   * Opens the task detail dialog when a task is clicked.
   * It passes the task data to the dialog and handles the response.
   * @param task The task data to be passed to the dialog.
   */
  openTaskDetailDialog(task: TaskInterface,): void {
    this.dialog.open(TaskDetailDialogComponent, {
      data: {
        task
      },
    }).afterClosed().subscribe(result => {
      this.handleResponse(result);
    })
  }

  /**
   * Handles the response from the task detail dialog.
   * It fetches the task and subtask data again to update the subtasks and progress.
   * @param response The response from the task detail dialog.
   */
  handleResponse(response: any): void {
    this.apiService.getTaskData();
    this.apiService.getSubtaskData().subscribe((response: any) => {
      let task = response.find((task: any) => task.id === this.task.id);
      this.subtasks = [];
      this.subtasks = task?.subtasks || [];
      this.subtaskValue = this.subtasks.length;
      this.calculateProgress();
    });
    this.dashboardService.editTask = false;
  }
}
