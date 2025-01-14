import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http = inject(HttpClient);
  APIURL = "http://127.0.0.1:8000/api/";
  userLogedIn = false;
  userData = {
    username: '',
    email: '',
    token: '',
    userId: 0,
  }

  postLogInData(data: any) {
    return this.http.post<any>(`${this.APIURL}logIn/`, data)
  }

  postSingUpData(data: any) {
    return this.http.post<any>(`${this.APIURL}signUp/`, data)
  }

  postContactData(data: any) {
    return this.http.post<any>(`${this.APIURL}contact/`, data)
  }

  getContactData() {
    return this.http.get<any>(`${this.APIURL}user-profile/${this.userData.userId}/contact/`)
  }

  
}
