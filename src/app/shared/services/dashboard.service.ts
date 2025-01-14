import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  showSummary = false;
  showAddTask = false;
  showBoard = false;
  showContacts = true;

  contacts: any[] = [
  ];

  getInitials(name: string): string {
    let splitedWord = name.split(' ')
    let initials = splitedWord.map(letter => letter.charAt(0).toUpperCase()).join('')
    return initials
  }

}
