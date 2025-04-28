import { inject, Injectable } from '@angular/core';
import { ContactInterface } from '../interfaces/contact-interface';
import { TaskInterface } from '../interfaces/task-interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  router = inject(Router);

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


  /**
   * Extracts the initials from a given name.
   * 
   * @param name - The full name as a string. If the name is empty or undefined, an empty string is returned.
   * @returns A string containing the uppercase initials of the words in the name.
   * 
   * @example
   * ```typescript
   * getInitials("John Doe"); // Returns "JD"
   * getInitials("Alice Bob Charlie"); // Returns "ABC"
   * getInitials(""); // Returns ""
   * ```
   */
  getInitials(name: string): string {
    if (!name) return '';
    let splitedWord = name.split(' ')
    let initials = splitedWord.map(letter => letter.charAt(0).toUpperCase()).join('')
    return initials
  }

  
  /**
   * Determines the appropriate icon name based on the priority of a task.
   *
   * @param task - The task object implementing the `TaskInterface` which contains a `prio` property.
   * @returns A string representing the icon name:
   * - `'keyboard_double_arrow_up'` for high priority.
   * - `'drag_handle'` for medium priority.
   * - `'keyboard_double_arrow_down'` for low priority or other cases.
   */
  controllPrio(task: TaskInterface): string {
    if (task.prio === 'high') {
      return 'keyboard_double_arrow_up';
    } else if (task.prio === 'medium') {
      return 'drag_handle';
    } else {
      return 'keyboard_double_arrow_down';
    }
  }

  /**
   * Navigates to the dashboard and displays either the privacy policy or legal notice based on the provided parameter.
   *
   * @param place - A string that determines which document to display. 
   *                If 'privacyPolicy', the privacy policy will be shown.
   *                If any other value, the legal notice will be shown.
   * @returns void
  */
  goToPrivacyPolicyOrLegalNotice(place: string): void {
    place === 'privacyPolicy' ? this.showPrivacyPolicy = true : this.showLegalNotice = true;
    this.router.navigate(['/dashboard']);
  }
}
