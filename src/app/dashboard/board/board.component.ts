import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { TaskCardComponent } from './task-card/task-card.component';
import { ApiService } from '../../shared/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from '../../shared/services/dashboard.service';
import { TaskInterface } from '../../shared/interfaces/task-interface';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';

@Component({
  selector: 'app-board',
  imports: [
    MatIconModule,
    CdkDropList,
    CdkDrag,
    TaskCardComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  apiService = inject(ApiService);
  dashboardService = inject(DashboardService);
  dialog = inject(MatDialog);

  ngOnInit() {
    this.apiService.getTaskData();
  }


  /**
   * Opens the add task dialog.
   */
  openAddTaskDialog(): void {
    this.dialog.open(AddTaskDialogComponent);
  }


  /**
   * Handles the drop event of the drag and drop operation.
   * @param event The event of the drag and drop operation.
   * @param taskCategory The task category to set the tasks in the event container to.
   */
  drop(event: CdkDragDrop<string[]>, taskCategory: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.updateTheMovedTask(event, taskCategory);
    }
  }


  /**
   * Updates the taskCategory of the tasks in the given event container to the category that matches the event container's id.
   * @param event The event of the drag and drop operation.
   */
  updateTheMovedTask(event: CdkDragDrop<string[]>, taskCategory: string): void {
    if (taskCategory === 'to-do') {
      this.setDataAndUpdateInBackend(event, taskCategory);
    } else if (taskCategory === 'in-progress') {
      this.setDataAndUpdateInBackend(event, taskCategory);
    } else if (taskCategory === 'await-feedback') {
      this.setDataAndUpdateInBackend(event, taskCategory);
    } else if (taskCategory === 'done') {
      this.setDataAndUpdateInBackend(event, taskCategory);
    }
  }


  /**
   * Updates the taskCategory of the tasks in the given event container to the given taskCategory.
   * @param event The event of the drag and drop operation.
   * @param taskCategory The task category to set the tasks in the event container to.
   */
  setDataAndUpdateInBackend(event: CdkDragDrop<string[]>, taskCategory: string): void {
    event.container.data.forEach((task: any) => {
      let data = {
        id: task.id,
        taskCategory: taskCategory
      }
      this.apiService.patchTaskData(data);
    });
  }
}
