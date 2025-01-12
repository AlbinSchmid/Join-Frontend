import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-form-left',
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    MatCheckboxModule
  ],
  templateUrl: './form-left.component.html',
  styleUrl: './form-left.component.scss'
})
export class FormLeftComponent {
  formData = {
    taskTitle: '',
    taskDescription: '',
    taskPriority: '',
    taskDueDate: '',
    taskStatus: '',
    taskSubtasks: '',
  }
  showDrowDownAssign = false;
  showDrowDownCategory = false;
  urgentBtn = false;
  mediumBtn = true;
  lowBtn = false;


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
