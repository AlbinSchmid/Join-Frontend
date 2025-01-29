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


  /**
   * Initializes the component.
   * Retrieves user data from local storage and fetches contact data.
   */
  ngOnInit(): void {
    this.apiService.getUserFormLocalStorage();
    setTimeout(() => {
      this.apiService.getContactData();
    }, 10);
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


  goToHelp() {
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
  goToPrivacyPolicy() {
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
  goToLegalNotice() {
    this.closeAllContentPages();
    this.dashboardService.showPrivacyPolicy = false;
    this.dashboardService.showLegalNotice = true;
    this.dashboardService.showHelpPage = false;
  }


  /**
   * Displays the summary section of the dashboard.
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
   */
  goToContacts(): void {
    this.dashboardService.showSummary = false;
    this.dashboardService.showAddTask = false;
    this.dashboardService.showBoard = false;
    this.dashboardService.showContacts = true;
    this.closeAllInfoPages();
  }


  closeAllInfoPages() {
    this.dashboardService.showPrivacyPolicy = false;
    this.dashboardService.showLegalNotice = false;
    this.dashboardService.showHelpPage = false;
  }


  closeAllContentPages() {
    this.dashboardService.showSummary = false;
    this.dashboardService.showAddTask = false;
    this.dashboardService.showBoard = false;
    this.dashboardService.showContacts = false;
  }


  /**
   * Logs out the user, clears local storage, and resets the dashboard state.
   */
  logout() {
    localStorage.clear();
    this.apiService.userLogedIn = false;
    this.dashboardService.showSummary = false;
    this.dashboardService.showAddTask = false;
    this.dashboardService.showBoard = false;
    this.dashboardService.showContacts = false;
    this.resetUser();
    this.router.navigate(['/']);
  }


  /**
   * Resets the user information in the API service.
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
