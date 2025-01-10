import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-add-task-form',
  imports: [
    FormsModule, 
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './add-task-form.component.html',
  styleUrl: './add-task-form.component.scss',
  standalone: true
})
export class AddTaskFormComponent {
  formData = {
    taskTitle: '',
    taskDescription: '',
    taskPriority: '',
    taskDueDate: '',
    taskStatus: '',
    taskSubtasks: '',
  }
  isDropdownOpen = false;

  keepDropdownOpen(event: Event) {
    event.preventDefault(); // Verhindert das Schließen des Dropdowns
}
}
