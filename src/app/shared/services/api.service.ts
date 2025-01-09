import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http = inject(HttpClient)
  APIURL = "http://127.0.0.1:8000/api/"

  postLogInData(data: any) {
    return this.http.post<any>(`${this.APIURL}logIn/`, data)
  }

  postSingUpData(data: any) {
    return this.http.post<any>(`${this.APIURL}signUp/`, data)
  }
}
