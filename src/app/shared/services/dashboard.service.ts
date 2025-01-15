import { Injectable } from '@angular/core';
import { ContactInterface } from '../interfaces/contact-interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  showSummary = false;
  showAddTask = false;
  showBoard = false;
  showContacts = true;
  
  contactDetailView = false;
  showContactsList = true;
  currentContact: ContactInterface = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    color: ''
  }
  contactCategoryLetters: string[] = []

  getInitials(name: string): string {
    let splitedWord = name.split(' ')
    let initials = splitedWord.map(letter => letter.charAt(0).toUpperCase()).join('')
    return initials
  }

}
