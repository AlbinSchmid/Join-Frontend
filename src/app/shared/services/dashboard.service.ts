import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  showSummary = false;
  showAddTask = false;
  showBoard = false;
  showContacts = false;
  UserToken = '';
  UserLogedIn = false;
}
