
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TaskInterface } from '../../../shared/interfaces/task-interface';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-task-detail-dialog',
  imports: [
    MatIconModule,
    CommonModule,
    MatCheckboxModule,
  ],
  templateUrl: './task-detail-dialog.component.html',
  styleUrl: './task-detail-dialog.component.scss'
})
export class TaskDetailDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<TaskDetailDialogComponent>);
  dashboardService = inject(DashboardService);
  task: TaskInterface = this.data.task;
  contacts: any[] = this.task.contacts;
  subtasks: any[] = this.task.subtasks;
  ngOnInit(): void {
    console.log(this.contacts[0].name);
  }


  firstLetterBig(prio:string):string {
    return prio.charAt(0).toUpperCase() + prio.slice(1);
  }


  closeDialog() {
    this.dialogRef.close();
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
