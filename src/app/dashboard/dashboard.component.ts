import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SummaryComponent } from './summary/summary.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { DashboardService } from '../shared/services/dashboard.service';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts/contacts.component';
import { BoardComponent } from './board/board.component';
import { ApiService } from '../shared/services/api.service';
import { Router } from '@angular/router';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { response } from 'express';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatIconModule,
    MatMenuModule,
    SummaryComponent,
    AddTaskComponent,
    CommonModule,
    ContactsComponent,
    BoardComponent,
    PrivacyPolicyComponent,
    LegalNoticeComponent,
    HelpPageComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  dashboardService = inject(DashboardService)
  apiService = inject(ApiService)
  router = inject(Router)

  windowWidth = window.innerWidth;

  /**
   * Initializes the component.
   * Retrieves user data from local storage and fetches contact data.
   */
  ngOnInit(): void {
    this.apiService.getUserFormLocalStorage();
    if (this.apiService.userLogedIn) {
      setTimeout(() => {
        this.apiService.getContactData();
      }, 10);
    }
  }

  /**
   * Switches the content displayed on the dashboard based on the provided content string.
   * 
   * @param content - The content to be displayed ('summary', 'addTask', 'board', 'contacts').
   */
  switchContent(content: string): void {
    if (content === 'summary') {
      this.goToSummary();
    } else if (content === 'addTask') {
      this.goToAddTask();
    } else if (content === 'board') {
      this.goToBoard();
    } else if (content === 'contacts') {
      this.goToContacts();
    } else if (content === 'privacyPolicy') {
      this.goToPrivacyPolicy();
    } else if (content === 'legalNotice') {
      this.goToLegalNotice();
    } else if (content === 'help') {
      this.goToHelp();
    }
  }

  /**
   * Navigates to the login page and closes all content and information pages.
   * 
   * This method performs the following actions:
   * - Navigates to the root route ('/').
   * - Closes all currently open content pages.
   * - Closes all currently open information pages.
   */
  goToLogIn(): void {
    this.router.navigate(['/']);
    this.closeAllContentPages();
    this.closeAllInfoPages();
  }

  /**
   * Navigates to the Help page by closing all other content pages
   * and setting the visibility flags accordingly.
   * 
   * This method performs the following actions:
   * - Closes all currently open content pages.
   * - Sets the `showHelpPage` flag to `true`.
   * - Sets the `showPrivacyPolicy` flag to `false`.
   * - Sets the `showLegalNotice` flag to `false`.
   */
  goToHelp(): void {
    this.closeAllContentPages();
    this.dashboardService.showPrivacyPolicy = false;
    this.dashboardService.showLegalNotice = false;
    this.dashboardService.showHelpPage = true;
  }
  
  /**
   * Navigates to the Privacy Policy page by closing all other content pages
   * and setting the visibility flags accordingly.
   * 
   * This method performs the following actions:
   * - Closes all currently open content pages.
   * - Sets the `showPrivacyPolicy` flag to `true`.
   * - Sets the `showLegalNotice` flag to `false`.
   * - Sets the `showHelpPage` flag to `false`.
   */
  goToPrivacyPolicy(): void {
    this.closeAllContentPages();
    this.dashboardService.showPrivacyPolicy = true;
    this.dashboardService.showLegalNotice = false;
    this.dashboardService.showHelpPage = false;
  }

  /**
   * Navigates to the Legal Notice page by closing all content pages and 
   * updating the dashboard service to show the Legal Notice while hiding 
   * the Privacy Policy and Help Page.
   */
  goToLegalNotice(): void {
    this.closeAllContentPages();
    this.dashboardService.showPrivacyPolicy = false;
    this.dashboardService.showLegalNotice = true;
    this.dashboardService.showHelpPage = false;
  }

  /**
   * Displays the summary section of the dashboard.
   * Hides other sections and closes all information pages.
   */
  goToSummary(): void {
    this.dashboardService.showSummary = true;
    this.dashboardService.showAddTask = false;
    this.dashboardService.showBoard = false;
    this.dashboardService.showContacts = false;
    this.closeAllInfoPages();
  }

  /**
   * Displays the add task section of the dashboard.
   * Hides other sections and closes all information pages.
   */
  goToAddTask(): void {
    this.dashboardService.showSummary = false;
    this.dashboardService.showAddTask = true;
    this.dashboardService.showBoard = false;
    this.dashboardService.showContacts = false;
    this.closeAllInfoPages();
  }

  /**
   * Displays the board section of the dashboard.
   * Resets the search input and hides other sections.
   */
  goToBoard(): void {
    this.dashboardService.searchTaskInput = '';
    this.dashboardService.showSummary = false;
    this.dashboardService.showAddTask = false;
    this.dashboardService.showBoard = true;
    this.dashboardService.showContacts = false;
    this.closeAllInfoPages();
  }

  /**
   * Displays the contacts section of the dashboard.
   * Resets the current contact to a default state.
   */
  goToContacts(): void {
    this.dashboardService.showSummary = false;
    this.dashboardService.showAddTask = false;
    this.dashboardService.showBoard = false;
    this.dashboardService.showContacts = true;
    this.dashboardService.currentContact = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      color: ''
    };
    this.closeAllInfoPages();
  }

  /**
   * Closes all information pages by setting the corresponding flags in the dashboard service to false.
   * This method is used to reset the state of the dashboard when navigating between different sections.
   */
  closeAllInfoPages() {
    this.dashboardService.showPrivacyPolicy = false;
    this.dashboardService.showLegalNotice = false;
    this.dashboardService.showHelpPage = false;
  }

  /**
   * Closes all content pages by setting the corresponding flags in the dashboard service to false.
   * This method is used to reset the state of the dashboard when navigating between different sections.
   */
  closeAllContentPages() {
    this.dashboardService.showSummary = false;
    this.dashboardService.showAddTask = false;
    this.dashboardService.showBoard = false;
    this.dashboardService.showContacts = false;
  }

  /**
   * Logs out the user by clearing local storage, resetting user data, and navigating to the login page.
   * If the user is a guest, it deletes the guest user from the API.
   */
  logout() {
    localStorage.clear();
    this.apiService.userLogedIn = false;
    this.dashboardService.showSummary = false;
    this.dashboardService.showAddTask = false;
    this.dashboardService.showBoard = false;
    this.dashboardService.showContacts = false;
    if (this.apiService.user.username === 'guest') {
      this.apiService.deleteUsers(this.apiService.user.userId).subscribe(() => {
      });
    }
    this.resetUser();
    this.router.navigate(['/']);
  }

  /**
   * Resets the user data in the API service to default values.
   * This method sets the username, email, token, and userId to empty strings or zero.
   */
  resetUser(): void {
    this.apiService.user = {
      username: '',
      email: '',
      token: '',
      userId: 0
    };
  }
}
