import { Component, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { MatDialog } from '@angular/material/dialog';
import { log } from 'node:console';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { DashboardService } from '../../shared/services/dashboard.service';
import { ApiService } from '../../shared/services/api.service';
import { CommonModule } from '@angular/common';
import { ContactInterface } from '../../shared/interfaces/contact-interface';
import { ContactButtonComponent } from './contact-button/contact-button.component';

@Component({
  selector: 'app-contacts',
  imports: [
    MatIconModule,
    ContactDetailComponent,
    CommonModule,
    ContactButtonComponent,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
  standalone: true
})
export class ContactsComponent {
  dashboardService = inject(DashboardService);
  apiService = inject(ApiService);
  dialog = inject(MatDialog);

  contactData: ContactInterface = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    color: ''
  };
  categoryLetters: string[] = []
  showContactDetail = false;
  windowWidth: number = window.innerWidth;


  /**
   * Initializes the component.
   * Resets the contact category letters and sets the contact detail view to false.
   */
  ngOnInit(): void {
    this.dashboardService.contactCategoryLetters = [];
    this.dashboardService.contactDetailView = false;
  }

  /**
   * Checks the current window width and determines whether the contact detail view should be displayed.
   *
   * @returns {boolean} - Returns `true` if the window width is greater than 1000 or if the contact detail view is not active; otherwise, returns `false`.
   */
  checkWindowWidth(): boolean {
    if (this.windowWidth > 1000) {
      return true;
    } else {
      if (this.dashboardService.contactDetailView) {
        return false;
      } else {
        return true;
      }
    }
  }
  
  /**
   * Closes the contact detail view and resets the current contact information.
   * 
   * This method sets the `currentContact` property of the `dashboardService` to an empty contact object
   * with default values. It also sets the `contactDetailView` property of the `dashboardService` to `false`,
   * effectively closing the contact detail view.
   * 
   * @returns {void}
   */
  closeContactDetail(): void {
    this.dashboardService.currentContact = {
      id: null,
      name: '',
      email: '',
      phone: '',
      color: ''
    };
    console.log(this.dashboardService.currentContact);
    this.dashboardService.contactDetailView = false;
  }

  /**
   * Checks if a category letter is needed for the given contact and returns the letter if it is needed.
   * If the letter is already in the categoryLetters array, it simply returns without doing anything.
   * @param contact - The contact object to check.
   * @returns The category letter if it is needed, otherwise nothing is returned.
   */
  checkIfCategoryIsNeeded(contact: ContactInterface): string | void {
    let categoryLetter = contact.name.charAt(0)
    if (!this.categoryLetters.includes(categoryLetter)) {
      this.categoryLetters.push(categoryLetter)
      return categoryLetter
    } else {
      return
    }
  }

  /**
   * Displays the details of a specific contact by setting the contact data
   * and toggling the visibility of the contact detail view.
   *
   * @param contact - The contact whose details are to be displayed.
   */
  openUserDetail(contact: ContactInterface): void {
    this.contactData = contact;
    this.showContactDetail = true;
  }

  /**
   * Opens a dialog window with the specified form type.
   *
   * @param formType - The type of form to open in the dialog, such as 'add' or 'edit'.
   */
  openDialog(formType: string): void {
    this.dialog.open(ContactFormComponent, {
      data: [{ form: formType }],
    });
  }
}
