
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TaskInterface } from '../../../shared/interfaces/task-interface';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService } from '../../../shared/services/api.service';
import { log } from 'node:console';
import { ContactInterface } from '../../../shared/interfaces/contact-interface';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AddTaskFormComponent } from '../../../shared/components/add-task-form/add-task-form.component';

@Component({
  selector: 'app-task-detail-dialog',
  providers: [provideNativeDateAdapter(), DatePipe],
  imports: [
    MatIconModule,
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    MatDatepickerModule,
    AddTaskFormComponent
  ],
  templateUrl: './task-detail-dialog.component.html',
  styleUrl: './task-detail-dialog.component.scss'
})
export class TaskDetailDialogComponent {
  apiService = inject(ApiService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<TaskDetailDialogComponent>);
  dashboardService = inject(DashboardService);
  
  task: TaskInterface = this.data.task;
  contacts: any[] = this.task.contacts;
  subtasks: any[] = this.task.subtasks;
  
  substaksCompleteValue = 0;
  editTask = false;

  constructor() {
    this.data = this.data || {contacts: []};
  }


  /**
   * Sets the subtask to completed or uncompleted and sends a request to the API to update the subtask.
   * The subtask is updated with the opposite of the current completed status. If the subtask is currently completed, it will be set to uncompleted and vice versa.
   * @param subtask The subtask to set to completed or uncompleted.
   */
  setSubtaskToCompleted(subtask: any): void {
    let trueOrFalse = !subtask.completed ? true : false;
    let data = {
      id: subtask.id,
      completed: trueOrFalse
    }
    this.apiService.patchSubtaskData(data).subscribe((response) => {
    });
  }
  

  /**
   * Deletes the task in the database and closes the dialog.
   * The task is first deleted by sending a request to the API with the task ID.
   * Then, the dialog is closed.
   */
  deleteTask():void {
    let data = {
      id: this.task.id
    }
    this.apiService.deleteTaskData(data);
    this.closeTaskDetailDialog();
  }
  

  /**
   * Convert the first letter of the given string to uppercase and return the result.
   * @param {string} prio The string to convert.
   * @returns {string} The string with the first letter uppercased.
   */
  firstLetterBig(prio: string):string {
    return prio.charAt(0).toUpperCase() + prio.slice(1);
  }


  /**
   * Close the task detail dialog.
   * @description This function closes the task detail dialog.
   */
  closeTaskDetailDialog():void {
    this.dialogRef.close(this.subtasks);
  }

}
