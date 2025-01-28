import { Injectable } from '@angular/core';
import { ContactInterface } from '../interfaces/contact-interface';
import { TaskInterface } from '../interfaces/task-interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  showSummary = false;
  showAddTask = false;
  showBoard = false;
  showContacts = false;
  showPrivacyPolicy = false;
  showLegalNotice = false;
  showHelpPage = false;
  editTask = false;

  showStartAnimation = true;
  
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


  todoAllTasks: TaskInterface[] = [];
  doneAllTasks: TaskInterface[] = [];
  inProgressAllTasks: TaskInterface[] = [];
  awaitFeedbackAllTasks: TaskInterface[] = [];

  todo: any[] = [];
  done: any[] = [];
  inProgress: any[] = [];
  awaitFeedback: any[] = [];

  searchTaskInput: string;



  getInitials(name: string): string {
    let splitedWord = name.split(' ')
    let initials = splitedWord.map(letter => letter.charAt(0).toUpperCase()).join('')
    return initials
  }


  controllPrio(task: TaskInterface): string {
    if (task.prio === 'high') {
      return 'keyboard_double_arrow_up';
    } else if (task.prio === 'medium') {
      return 'drag_handle';
    } else {
      return 'keyboard_double_arrow_down';
    }
  }
}
