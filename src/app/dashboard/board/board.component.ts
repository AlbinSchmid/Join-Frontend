import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { log } from 'console';
import { TaskCardComponent } from './task-card/task-card.component';
import { ApiService } from '../../shared/services/api.service';
import { firstValueFrom } from 'rxjs';
import { appConfig } from '../../app.config';
import { TaskInterface } from '../../shared/interfaces/task-interface';

@Component({
  selector: 'app-board',
  imports: [
    MatIconModule,
    CdkDropList,
    CdkDrag,
    TaskCardComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  apiService = inject(ApiService);
  todo: any[] = [];
  done: any[] = [];
  inProgress: any[] = [];
  awaitFeedback: any[] = [];

  async ngOnInit() {
    const response: any = await firstValueFrom(this.apiService.getTaskData());
    this.apiService.task = response;
    this.todo = this.apiService.task.filter((task) => task.taskCategory === 'to-do');
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
