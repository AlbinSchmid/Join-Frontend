import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContactInterface } from '../interfaces/contact-interface';
import { log } from 'node:console';
import { DashboardService } from './dashboard.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  dashboardService = inject(DashboardService)
  http = inject(HttpClient);

  APIURL = "http://127.0.0.1:8000/api/";

  userLogedIn = false;

  user = {
    username: '',
    email: '',
    token: '',
    userId: 0
  };
  contacts: ContactInterface[] = [];
  task: any[] = [];

  getUserFormLocalStorage():void {
    const storedUser = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.user = storedUser
  }


  postLogInData(data: any) {
    return this.http.post<any>(`${this.APIURL}logIn/`, data)
  }


  postGuestLogInData(data: any) {
    return this.http.post<any>(`${this.APIURL}guest-login/`, data)
  }


  postSingUpData(data: any) {
    return this.http.post<any>(`${this.APIURL}signUp/`, data)
  }


  postRequest(data: any, endpoint: string) {
    return this.http.post<any>(`${this.APIURL}${endpoint}/`, data)
  }


  deleteContactData(data: any): void {
    let request = this.http.delete<any>(`${this.APIURL}contact/${data.id}/`)
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


  relaodContact(): void {
    this.dashboardService.showContactsList = false;
    this.dashboardService.contactCategoryLetters = [];
    setTimeout(() => {
      this.dashboardService.showContactsList = true;
    }, 10);

  }


  patchContactData(data: any): void {
    let request = this.http.patch<any>(`${this.APIURL}contact/${data.id}/`, data)
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


  getContactData(): void {
    let request = this.http.get<any>(`${this.APIURL}user-profile/${this.user.userId}/contact/`)
    request.subscribe((response) => {
      this.contacts = response
      this.sortContacts();
    })
  }


  getTaskData(): any {
    return this.http.get<any>(`${this.APIURL}user-profile/${this.user.userId}/task/`).subscribe((response) => {
      this.task = response;
      this.filterTaskWithTaskCategory();
    });
  }


  getSubtaskData(): any {
    return this.http.get<any>(`${this.APIURL}user-profile/${this.user.userId}/task/`)
  }


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


  patchTaskData(data: any): void {
    let request = this.http.patch<any>(`${this.APIURL}task/${data.id}/`, data)
    request.subscribe((response) => {
      this.task = this.task.map((task) => task.id === response.id ? response : task);
      this.getTaskData();
    })
  }


  patchTaskDataContacts(data: any): void {
    let request = this.http.patch<any>(`${this.APIURL}edit-contact/task/${data.id}/`, data)
    request.subscribe((response) => {
      this.task = this.task.map((task) => task.id === response.id ? response : task);
    })
  }


  patchSubtaskData(data: any): Observable<any> {
    return this.http.patch<any>(`${this.APIURL}subtask/${data.id}/`, data);
  }


  deleteTaskData(data: any): void {
    this.task = this.task.filter((task) => task.id !== data.id);
    let request = this.http.delete<any>(`${this.APIURL}task/${data.id}/`);
    request.subscribe(response => {
      this.filterTaskWithTaskCategory();
    })
  }


  sortContacts(): void {
    this.contacts.sort((a, b) => {
      const aNames = a.name.toUpperCase().split(' ');
      const bNames = b.name.toUpperCase().split(' ');
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
    });
  }
}
