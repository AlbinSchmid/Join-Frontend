import { Component } from '@angular/core';
import { AddTaskFormComponent } from '../../shared/components/add-task-form/add-task-form.component';

@Component({
  selector: 'app-add-task',
  imports: [AddTaskFormComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {

}
