import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContactInterface } from '../interfaces/contact-interface';
import { DashboardService } from './dashboard.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  dashboardService = inject(DashboardService)
  http = inject(HttpClient);
  API_URL = "http://127.0.0.1:8000/api/";
  userLogedIn = false;
  user = {
    username: '',
    email: '',
    token: '',
    userId: 0
  };
  contacts: ContactInterface[] = [];
  task: any[] = [];

 
  /**
   * Fetches all user profiles from the API.
   *
   * @returns An `Observable` containing the response with user profile data.
   */
  getAllUser() {
    return this.http.get<any>(`${this.API_URL}user-profile/`)
  }

  
  /**
   * Deletes a user profile by its unique identifier.
   *
   * @param id - The unique identifier of the user profile to be deleted.
   * @returns An `Observable` of the HTTP delete response.
   */
  deleteUsers(id: number) {
    return this.http.delete<any>(`${this.API_URL}user-profile/${id}/`);
  }

  /**
   * Saves user data in local storage.
   *
   * @param data - The user data to be saved.
   */
  getUserFormLocalStorage():void {
    const storedUser = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.user = storedUser
    if (this.user.userId) {
      this.userLogedIn = true;
    }
  }

  /**
   * Clears user data from local storage.
   */
  postLogInData(data: any) {
    return this.http.post<any>(`${this.API_URL}logIn/`, data)
  }

  /**
   * Sends a request to the API to log in as a guest user.
   *
   * @param data - The data to be sent in the request.
   * @returns An `Observable` containing the response from the API.
   */
  postGuestLogInData(data: any) {
    return this.http.post<any>(`${this.API_URL}guest-login/`, data)
  }

  /**
   * Sends a request to the API to sign up a new user.
   *
   * @param data - The data to be sent in the request.
   * @returns An `Observable` containing the response from the API.
   */
  postSingUpData(data: any) {
    return this.http.post<any>(`${this.API_URL}signUp/`, data)
  }

  /**
   * Sends a request to the API to create a new contact.
   *
   * @param data - The data to be sent in the request.
   * @param endpoint - The endpoint for the API request.
   * @returns An `Observable` containing the response from the API.
   */
  postRequest(data: any, endpoint: string) {
    return this.http.post<any>(`${this.API_URL}${endpoint}/`, data)
  }

  /**
   * Sends a request to the API to create a new task.
   *
   * @param data - The data to be sent in the request.
   * @param endpoint - The endpoint for the API request.
   * @returns An `Observable` containing the response from the API.
   */
  deleteContactData(data: any): void {
    let request = this.http.delete<any>(`${this.API_URL}contact/${data.id}/`)
    request.subscribe((response) => {
      this.contacts = this.contacts.filter((contact) => contact.id !== data.id);
      this.relaodContact();
      this.dashboardService.contactDetailView = false;
      this.dashboardService.currentContact = {
        id: 0,
        name: '',
        email: '',
        phone: '',
        color: ''
      }
    })
  }

  
  /**
   * Reloads the contact list by temporarily hiding it and resetting the contact category letters.
   * After a short delay, the contact list is displayed again.
   *
   * This method is useful for refreshing the contact list view in the dashboard.
   */
  relaodContact(): void {
    this.dashboardService.showContactsList = false;
    this.dashboardService.contactCategoryLetters = [];
    setTimeout(() => {
      this.dashboardService.showContactsList = true;
    }, 10);
  }

  /**
   * Sends a request to the API to update a contact's data.
   *
   * @param data - The data to be sent in the request.
   */
  patchContactData(data: any): void {
    let request = this.http.patch<any>(`${this.API_URL}contact/${data.id}/`, data)
    request.subscribe((response) => {
      this.dashboardService.showContactsList = false;
      this.dashboardService.contactCategoryLetters = [];
      let editContactId = this.contacts.findIndex(contact => contact.id === response.id)
      this.contacts[editContactId] = response
      this.sortContacts();
      setTimeout(() => {
        this.dashboardService.showContactsList = true;
      }, 10);
    })
  }

  /**
   * Fetches contact data for the logged-in user from the API.
   *
   * @returns An `Observable` containing the response with contact data.
   */
  getContactData(): void {
    let request = this.http.get<any>(`${this.API_URL}user-profile/${this.user.userId}/contact/`)
    request.subscribe((response) => {
      this.contacts = response
      this.sortContacts();
    })
  }

  /**
   * Fetches task data for the logged-in user from the API.
   *
   * @returns An `Observable` containing the response with task data.
   */
  getTaskData(): any {
    return this.http.get<any>(`${this.API_URL}user-profile/${this.user.userId}/task/`).subscribe((response) => {
      this.task = response;
      this.filterTaskWithTaskCategory();
    });
  }

  /**
   * Fetches subtask data for the logged-in user from the API.
   *
   * @returns An `Observable` containing the response with subtask data.
   */
  getSubtaskData(): any {
    return this.http.get<any>(`${this.API_URL}user-profile/${this.user.userId}/task/`)
  }

  /**
   * Filters tasks based on their categories and updates the corresponding properties in the dashboard service.
   * The filtered tasks are stored in the dashboard service for further use.
   */
  filterTaskWithTaskCategory(): void {
    this.dashboardService.todoAllTasks = this.task.filter((task) => task.taskCategory === 'to-do');
    this.dashboardService.doneAllTasks = this.task.filter((task) => task.taskCategory === 'done');
    this.dashboardService.inProgressAllTasks = this.task.filter((task) => task.taskCategory === 'in-progress');
    this.dashboardService.awaitFeedbackAllTasks = this.task.filter((task) => task.taskCategory === 'await-feedback');
    let searchTerm = this.dashboardService.searchTaskInput;
    this.dashboardService.todo = this.dashboardService.todoAllTasks;
    this.dashboardService.done = this.dashboardService.doneAllTasks;
    this.dashboardService.inProgress = this.dashboardService.inProgressAllTasks;
    this.dashboardService.awaitFeedback = this.dashboardService.awaitFeedbackAllTasks;
  }

  /**
   * Updates the task data in the backend and refreshes the task list.
   *
   * @param data - The data to be sent in the request.
   */
  patchTaskData(data: any): void {
    let request = this.http.patch<any>(`${this.API_URL}task/${data.id}/`, data)
    request.subscribe((response) => {
      this.task = this.task.map((task) => task.id === response.id ? response : task);
      this.getTaskData();
    })
  }

  /**
   * Updates the task data in the backend and refreshes the task list.
   *
   * @param data - The data to be sent in the request.
   */
  patchTaskDataContacts(data: any): void {
    let request = this.http.patch<any>(`${this.API_URL}edit-contact/task/${data.id}/`, data)
    request.subscribe((response) => {
      this.task = this.task.map((task) => task.id === response.id ? response : task);
    })
  }

  /**
   * Updates the subtask data in the backend.
   *
   * @param data - The data to be sent in the request.
   * @returns An `Observable` containing the response from the API.
   */
  patchSubtaskData(data: any): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}subtask/${data.id}/`, data);
  }

  /**
   * Deletes a task by its unique identifier.
   *
   * @param data - The data containing the unique identifier of the task to be deleted.
   */
  deleteTaskData(data: any): void {
    this.task = this.task.filter((task) => task.id !== data.id);
    let request = this.http.delete<any>(`${this.API_URL}task/${data.id}/`);
    request.subscribe(response => {
      this.filterTaskWithTaskCategory();
    })
  }

  /**
   * Deletes a subtask by its unique identifier.
   *
   * @param data - The data containing the unique identifier of the subtask to be deleted.
   */
  sortContacts(): void {
    this.contacts.sort((a, b) => {
      const aNames = a.name.toUpperCase().split(' ');
      const bNames = b.name.toUpperCase().split(' ');
      return this.getSortNumbers(aNames, bNames);
    });
  }

  /**
   * Sorts the contacts based on the first two letters of their names.
   *
   * @param aNames - The first two letters of the first contact's name.
   * @param bNames - The first two letters of the second contact's name.
   * @returns A number indicating the sort order.
   */
  getSortNumbers(aNames: any, bNames: any): number {
    if (aNames[0] < bNames[0]) {
      return -1;
    } else if (aNames[0] > bNames[0]) {
      return 1;
    }
    if (aNames[1] < bNames[1]) {
      return -1;
    } else if (aNames[1] > bNames[1]) {
      return 1;
    }
    return 0;
  } 
}
