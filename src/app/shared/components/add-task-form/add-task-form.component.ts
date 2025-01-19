import { CommonModule } from '@angular/common';
import { Component, inject, Input, Optional, Output, output } from '@angular/core';
import { Form, FormsModule, NgForm } from '@angular/forms';
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
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TaskInterface } from '../../interfaces/task-interface';
import { SubtaskInterface } from '../../interfaces/subtask-interface';
import { Data } from '@angular/router';
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
    MatDialogModule
  ],
  templateUrl: './add-task-form.component.html',
  styleUrl: './add-task-form.component.scss'
})
export class AddTaskFormComponent {
  apiService = inject(ApiService);
  dashboardService = inject(DashboardService);
  datePipe = inject(DatePipe);

  @Input() formType: string;
  @Input() task: TaskInterface;
  closeFormDialog = output<void>();

  addTaskForm = {
    title: '',
    description: '',
    prio: '',
    date: new Date(),
    category: '',
  }

  createdSubtasks: SubtaskInterface[] = [];

  allContacts: ContactInterface[] = [];
  assingedContacts: ContactInterface[] = [];

  editAssingedContact: any[] = [];


  subtaskInput = '';
  editSubtaskInput = '';
  editSubtaskId: Number | null;

  showDrowDownAssign = false;
  showDrowDownCategory = false;
  urgentBtn = false;
  mediumBtn = true;
  lowBtn = false;


  ngOnInit() {
    if (this.formType == 'editTask') {
      this.getEditTaskData();
    }
    this.getAllContacts();
  }


  getEditTaskData(): void {
    this.addTaskForm.title = this.task.title;
    this.addTaskForm.description = this.task.description;
    this.addTaskForm.prio = this.task.prio;
    this.addTaskForm.date = new Date(this.task.date);
    this.addTaskForm.category = this.task.category;
    this.createdSubtasks = this.task.subtasks;
    this.editAssingedContact = JSON.parse(JSON.stringify(this.task.contacts));
  }


  /**
   * Gets all contacts from the API and stores them in the `allContacts` array.
   * 
   * This function is called in the `ngOnInit` lifecycle hook and is used to populate
   * the contact list for the task assignee select menu.
   */
  getAllContacts(): void {
    this.apiService.contacts.forEach((contact) => this.allContacts.push(contact));
  }


  submitEditTaskForm(ngForm: NgForm): void {
    if (ngForm.valid && ngForm.submitted) {
      this.saveEditTask();
    }
  }


  saveEditTask(): void {
    
    let data = this.getCreatedTaskData(this.editAssingedContact);
    console.log(data);
    this.apiService.patchTaskData(data);
    
  }


  /**
   * Handles the form submission for creating a new task.
   * 
   * @param ngForm - The form object containing the user's input.
   * 
   * This function validates the form and checks if it has been submitted.
   * If both conditions are true, it proceeds to create a new task using the provided data.
   */
  submitForm(ngForm: NgForm): void {
    if (ngForm.valid && ngForm.submitted) {
      this.createTask();
    }
  }


  /**
   * Creates a new task by sending a POST request to the API with the task data.
   * 
   * The task data is obtained by calling `getCreatedTaskData()`. Upon a successful
   * response, the task is added to the `todo` list in the `dashboardService`, the
   * form is reset, and the dialog is closed. If there is an error, it is logged to
   * the console.
   */
  createTask(): void {
    let data = this.getCreatedTaskData(this.assingedContacts);
    this.apiService.postRequest(data, 'task').subscribe((response) => {
      this.dashboardService.todo.push(response);
      this.resestForm();
      this.closeDialog();
    }, (error) => {
      console.error(error);
    });
  }


  /**
   * Takes the form data and formats it into an object that can be posted to the
   * server to create a new task.
   * 
   * @returns The formatted data object.
   */
  getCreatedTaskData(contactJson: ContactInterface[]): Object {
    let formattdDate = this.datePipe.transform(this.addTaskForm.date, 'yyyy-MM-dd');
    let contactIds = contactJson.map((contact) => contact.id);
    return {
      id: this.task.id,
      title: this.addTaskForm.title,
      description: this.addTaskForm.description,
      date: formattdDate,
      prio: this.addTaskForm.prio,
      category: this.addTaskForm.category,
      taskCategory: 'to-do',
      // subtasks: this.createdSubtasks,
      contact_ids: contactIds,
      user_id: this.apiService.user.userId
    }
  }


  searchContact(searchTerm: any): void {
    this.showDrowDownAssign = true;
    this.allContacts = this.apiService.contacts.filter((contact) => contact.name.toLowerCase().startsWith(searchTerm.value.toLowerCase()));
  }


  setAssignContact(contact: any, type: string): void {
    if (type == 'add') {
      this.assingedContacts.includes(contact) ? this.assingedContacts.splice(this.assingedContacts.indexOf(contact), 1) : this.assingedContacts.push(contact);
    } else if (type == 'edit') {
      if (this.editAssingedContact.some(contactObj => contactObj.id === contact.id)) {
        this.editAssingedContact = this.editAssingedContact.filter(contactObj => contactObj.id !== contact.id);
      } else {
        this.editAssingedContact.push(contact);
      }
    } 
  }


  checkIfIncluded(contact: any): boolean {
    const exists = this.editAssingedContact.some(contactObj => contactObj.id === contact.id);
    return exists;
  }





  // safeEditSubtaskInEditTask(id: number): void {
  //   this.editTaskSubtasks[id].title = this.editSubtaskInput;
  //   this.editSubtaskId = -1;
  // }


  // removeSubtaskInEditTask(id: number): void {
  //   this.editTaskSubtasks.splice(id, 1);
  //   this.editSubtaskId = -1;
  // }


  // addSubtaskInEditTask() {
  //   console.log(this.subtaskInput)
  //   this.editTaskSubtasks.unshift(this.subtaskInput);
  //   this.subtaskInput = '';
  //   console.log(this.editTaskSubtasks)
  // }



  // editTheSubtaskInEditTask(subtaskTitle: string, id: number): void {
  //   this.editSubtaskInput = subtaskTitle;
  //   this.editSubtaskId = id;
  // }


  /**
   * Creates a new subtask and adds it to the list of created subtasks.
   *
   * This function generates a clean JSON object representing a new subtask
   * with default properties using `gedCreatedSubtaskCleanJson()` and prepends
   * it to the `createdSubtasks` array. It then clears the `subtaskInput` field.
   */
  createSubtask(): void {
    const subtaskJson = this.gedCreatedSubtaskCleanJson();
    this.createdSubtasks.unshift(subtaskJson);
    this.subtaskInput = '';
  }


  /**
   * Returns a clean JSON object representing a new subtask with the given title
   * and the default values for id and completed.
   * @returns {SubtaskInterface} A clean JSON object representing a new subtask.
   */
  gedCreatedSubtaskCleanJson(): SubtaskInterface {
    return {
      id: null,
      title: this.subtaskInput,
      completed: false
    }
  }


  /**
   * Sets the editSubtaskInput to the title of the subtask with the given id
   * and sets the editSubtaskId to the given id.
   * @param {SubtaskInterface} subtask The subtask to edit.
   * @param {number} id The id of the subtask to edit.
   */
  editTheCreatedSubtask(subtask: SubtaskInterface, id: number): void {
    this.editSubtaskInput = subtask.title;
    this.editSubtaskId = id;
  }


  /**
   * Sets the title of the subtask with the given id to the current editSubtaskInput
   * and resets the editSubtaskId to null.
   * @param {number} id The id of the subtask to edit.
   */
  safeEditSubtask(id: number): void {
    this.createdSubtasks[id].title = this.editSubtaskInput;
    this.editSubtaskId = null;
  }


  /**
   * Deletes the subtask with the given id from the list of created subtasks.
   * @param {number} id The id of the subtask to delete.
   */
  deleteCreadedSubtask(id: number): void {
    this.createdSubtasks.splice(id, 1);
    this.editSubtaskId = null;
  }

  /**
   * Sets the category of the task based on the given type.
   * @param {string} categoryType The type of category, either 'userStory' or 'technicalTask'.
   * The category will be set to 'User Story' if the parameter is 'userStory', otherwise it will be set to 'Technical Task'.
   * The dropdown menu will be hidden after the category is set.
   */
  setCategory(categoryType: string): void {
    categoryType === 'userStory' ? this.addTaskForm.category = 'User Story' : this.addTaskForm.category = 'Technical Task'
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
  setTaskPrio(prioType: string): void {
    if (prioType === 'high') {
      this.setPrioHigh();
    } else if (prioType === 'medium') {
      this.setPrioMedium();
    } else if (prioType === 'low') {
      this.setPrioLow();
    }
  }


  /**
   * Sets the priority of the task to 'high' and updates the state of the buttons to reflect this.
   */
  setPrioHigh(): void {
    this.urgentBtn = true
    this.mediumBtn = false
    this.lowBtn = false
    this.addTaskForm.prio = 'high';
  }


  /**
   * Sets the priority of the task to 'medium' and updates the state of the buttons to reflect this.
   */
  setPrioMedium(): void {
    this.urgentBtn = false
    this.mediumBtn = true
    this.lowBtn = false
    this.addTaskForm.prio = 'medium';
  }


  /**
   * Sets the priority of the task to 'low' and updates the state of the buttons to reflect this.
   */
  setPrioLow(): void {
    this.urgentBtn = false
    this.mediumBtn = false
    this.lowBtn = true
    this.addTaskForm.prio = 'low';
  }


  /**
   * Closes the dialog with an 'add' action.
   * 
   * This method is called when the user clicks the cancel button in the dialog.
   * It will close the dialog and pass the 'add' action to the parent component.
   */
  closeDialog(): void {
    this.closeFormDialog.emit();
  }


  /**
   * Resets the form fields to their default values.
   * This method is called whenever the user clicks the "Clear" button.
   * It resets all the form fields to empty strings, and resets the assigned contacts and subtasks to empty arrays.
   */
  resestForm(): void {
    this.addTaskForm.title = '';
    this.addTaskForm.description = '';
    this.addTaskForm.prio = '';
    this.addTaskForm.date = new Date();
    this.addTaskForm.category = '';
    this.subtaskInput = '';
    this.assingedContacts = [];
    this.createdSubtasks = [];
  }
}
