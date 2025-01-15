import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContactInterface } from '../interfaces/contact-interface';
import { log } from 'node:console';
import { DashboardService } from './dashboard.service';

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


  postLogInData(data: any) {
    return this.http.post<any>(`${this.APIURL}logIn/`, data)
  }


  postSingUpData(data: any) {
    return this.http.post<any>(`${this.APIURL}signUp/`, data)
  }


  postContactData(data: any) {
    return this.http.post<any>(`${this.APIURL}contact/`, data)
  }


  deleteContactData(data: any):void {
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


  patchContactData(data: any):void {
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


  getContactData():void {
    let request = this.http.get<any>(`${this.APIURL}user-profile/${this.user.userId}/contact/`)
    request.subscribe((response) => {
      this.contacts = response
      this.sortContacts();
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
