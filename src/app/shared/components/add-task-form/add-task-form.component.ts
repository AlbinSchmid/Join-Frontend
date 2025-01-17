import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
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
import { ApiService } from '../../services/api.service';
import { DashboardService } from '../../services/dashboard.service';
import { ContactInterface } from '../../interfaces/contact-interface';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-add-task-form',
  providers: [provideNativeDateAdapter(), DatePipe],
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
    MatButtonModule,
  ],
  templateUrl: './add-task-form.component.html',
  styleUrl: './add-task-form.component.scss',
  standalone: true
})
export class AddTaskFormComponent {
  apiService = inject(ApiService);
  dashboardService = inject(DashboardService);
  datePipe = inject(DatePipe);

  @Input() type?: string;

  formData = {
    taskTitle: '',
    taskDescription: '',
    taskPrio: '',
    taskDueDate: '',
    taskCategory: '',
  }
  taskSubtasks: string[] = [];
  contactToAssinged: ContactInterface[] = [];
  assingedContact: ContactInterface[] = [];
  subtaskInput = '';
  editSubtaskInput = '';
  editSubtaskId = -1;

  showDrowDownAssign = false;
  showDrowDownCategory = false;

  urgentBtn = false;
  mediumBtn = true;
  lowBtn = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.apiService.contacts.forEach((contact) => this.contactToAssinged.push(contact));
    }, 10);
  }


  submitForm(ngForm: any): void {
    if (ngForm.valid && ngForm.submitted) {
      this.createTask();
    }
  }


  createTask(): void {
    this.getPriority();
    let data = this.setData();
    this.apiService.postRequest(data, 'task').subscribe((response) => {
      console.log(response);
      this.resestForm();
    }, (error) => {
      console.log(error);
    });
  }

  resestForm(): void {
    this.formData.taskTitle = '';
    this.formData.taskDescription = '';
    this.formData.taskPrio = '';
    this.formData.taskDueDate = '';
    this.formData.taskCategory = '';
    this.assingedContact = [];
    this.taskSubtasks = [];
  }

  setData(): any {
    let formattdDate = this.datePipe.transform(this.formData.taskDueDate ,'yyyy-MM-dd');
    let subtasks: object = [];
    subtasks = this.getSubtasks();
    let contactIds = this.assingedContact.map((contact) => contact.id); 
    return {
      title: this.formData.taskTitle,
      description: this.formData.taskDescription,
      date: formattdDate,
      prio: this.formData.taskPrio,
      category: this.formData.taskCategory,
      taskCategory: 'to-do',
      subtasks: subtasks,
      contact_ids: contactIds,
      user_id: this.apiService.user.userId
    }
  }


  getSubtasks(): object {
    let subtasks = [];
    for (let index = 0; index < this.taskSubtasks.length; index++) {
      const substask = this.taskSubtasks[index];
      let subtaskJson = { title: substask }
      subtasks.push(subtaskJson);
    }
    return subtasks
  }


  getPriority(): void {
    if (this.urgentBtn) {
      this.formData.taskPrio = 'high';
    } else if (this.mediumBtn) {
      this.formData.taskPrio = 'medium';
    } else {
      this.formData.taskPrio = 'low';
    }
  }


  /**
   * Filters the list of contacts and updates the contacts to be assigned based on the search term.
   *
   * This method toggles the visibility of the dropdown menu for assigning contacts
   * and filters the available contacts whose names start with the search term.
   *
   * @param {any} searchTerm - The search term used to filter contacts by name.
   */
  searchAssign(searchTerm: any): void {
    this.showDrowDownAssign = true;
    this.contactToAssinged = this.apiService.contacts.filter((contact) => contact.name.toLowerCase().startsWith(searchTerm.value.toLowerCase()));
  }


  /**
   * Adds or removes a contact from the assigned contacts list.
   *
   * If the contact is already in the assigned contacts list, it is removed.
   * Otherwise, it is added.
   * @param {ContactInterface} contact The contact to add or remove from the assigned contacts list.
   */
  setAssign(contact: ContactInterface): void {
    this.assingedContact.includes(contact) ? this.assingedContact.splice(this.assingedContact.indexOf(contact), 1) : this.assingedContact.push(contact);
  }


  /**
   * Safely edits a subtask at the specified index with the current input.
   * Updates the subtask in the taskSubtasks array and resets editSubtaskId to -1.
   * @param {number} id The index of the subtask to edit.
   */
  safeEditSubtask(id: number): void {
    this.taskSubtasks[id] = this.editSubtaskInput;
    this.editSubtaskId = -1;
  }


  /**
   * Removes the subtask with the given id from the task.
   * The editSubtaskId is also reset to -1.
   * @param {number} id The id of the subtask to remove.
   */
  removeSubtask(id: number): void {
    this.taskSubtasks.splice(id, 1);
    this.editSubtaskId = -1;
    console.log(this.taskSubtasks);
  }


  /**
   * Sets the input for the subtask with the given id to edit mode.
   * The input for the subtask will be set to the given subtask string and the editSubtaskId will be set to the given id.
   * The user can then edit the subtask and save the changes by clicking the checkmark icon.
   * @param {string} subtask The string of the subtask to edit.
   * @param {number} id The id of the subtask to edit.
   */
  editTheSubtask(subtask: string, id: number): void {
    this.editSubtaskInput = subtask;
    this.editSubtaskId = id;
  }


  /**
   * Adds a new subtask to the task based on the input in the subtask input field.
   * The input is added to the beginning of the taskSubtasks array and the input is reset to an empty string.
   */
  addSubtask(): void {
    this.taskSubtasks.unshift(this.subtaskInput);
    this.subtaskInput = '';
  }


  /**
   * Sets the category of the task based on the given type.
   * @param {string} categoryType The type of category, either 'userStory' or 'technicalTask'.
   * The category will be set to 'User Story' if the parameter is 'userStory', otherwise it will be set to 'Technical Task'.
   * The dropdown menu will be hidden after the category is set.
   */
  setCategory(categoryType: string): void {
    categoryType === 'userStory' ? this.formData.taskCategory = 'User Story' : this.formData.taskCategory = 'Technical Task'
    this.showDrowDownCategory = false;
  }


  /**
   * Toggles the visibility of the dropdown menu for the given type.
   * @param {string} dropDownType The type of dropdown menu to toggle, either 'category' or 'assign'.
   */
  openDrowDown(dropDownType: string): void {
    dropDownType === 'category' ? this.showDrowDownCategory = !this.showDrowDownCategory : this.showDrowDownCategory = false
    dropDownType === 'assign' ? this.showDrowDownAssign = !this.showDrowDownAssign : this.showDrowDownAssign = false
  }


  /**
   * Sets the priority of the task based on the given type.
   * @param {string} prioType The type of priority, either 'urgent', 'medium', or 'low'.
   */
  setPrio(prioType: string): void {
    if (prioType === 'high') {
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
