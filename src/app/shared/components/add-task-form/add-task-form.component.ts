import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { log } from 'console';
@Component({
  selector: 'app-add-task-form',
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  templateUrl: './add-task-form.component.html',
  styleUrl: './add-task-form.component.scss',
  standalone: true
})
export class AddTaskFormComponent {
  formData = {
    taskTitle: '',
    taskDescription: '',
    taskPrio: '',
    taskDueDate: '',
    taskCategory: '',
  }
  taskSubtasks: string[] = [];
  subtaskInput = '';
  editSubtaskInput = '';
  editSubtaskId = -1;

  showDrowDownAssign = false;
  showDrowDownCategory = false;

  urgentBtn = false;
  mediumBtn = true;
  lowBtn = false;

  submitForm(ngForm: any): void {
  }

  safeEditSubtask(id: number): void {
    this.taskSubtasks[id] = this.editSubtaskInput;
    this.editSubtaskId = -1;
  }
  

  removeSubtask(id: number): void {
    this.taskSubtasks.splice(id, 1);
    this.editSubtaskId = -1;
    console.log(this.taskSubtasks);
  }


  editTheSubtask(subtask: string, id: number):void {
    this.editSubtaskInput = subtask;
    this.editSubtaskId = id;
  }


  addSubtask(): void {
    this.taskSubtasks.unshift(this.subtaskInput);
    this.subtaskInput = '';
  }

  
  setCategory(categoryType: string): void {
    categoryType === 'userStory' ? this.formData.taskCategory = 'User Story' : this.formData.taskCategory = 'Technical Task'
    this.showDrowDownCategory = false;
  }


  openDrowDown(dropDownType: string): void {
    dropDownType === 'category' ? this.showDrowDownCategory = !this.showDrowDownCategory : this.showDrowDownCategory = false
    dropDownType === 'assign' ? this.showDrowDownAssign = !this.showDrowDownAssign : this.showDrowDownAssign = false
  }


  setPrio(prioType: string): void {
    if (prioType === 'urgent') {
      this.urgentBtn = true
      this.mediumBtn = false
      this.lowBtn = false
    } else if (prioType === 'medium') {
      this.urgentBtn = false
      this.mediumBtn = true
      this.lowBtn = false
    } else if (prioType === 'low') {
      this.urgentBtn = false
      this.mediumBtn = false
      this.lowBtn = true
    }
  }
}
