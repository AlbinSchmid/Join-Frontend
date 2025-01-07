import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  showSummary = false;
  showAddTask = true;
  showBoard = false;
  showContacts = false;
}
