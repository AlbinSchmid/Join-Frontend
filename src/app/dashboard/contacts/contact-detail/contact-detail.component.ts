import { Component, inject, Input, output, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { ContactInterface } from '../../../shared/interfaces/contact-interface';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../shared/services/api.service';
import { log } from 'console';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-contact-detail',
  imports: [
    MatIconModule,
    CommonModule
  ],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss'
})
export class ContactDetailComponent {
  dialog = inject(MatDialog);
  apiService = inject(ApiService)
  dashboardService = inject(DashboardService)
  detailViewClose = output<void>();
  windowWidth: number = window.innerWidth;


  /**
   * Deletes the current contact.
   * 
   * This method deletes the contact by sending a request to the API with the contact ID.
   * It then filters the contact out from the local contacts list and closes the dialog
   * with a 'delete' action.
   */
  deleteContact(): void {
    let data = { id: this.dashboardService.currentContact.id }
    this.apiService.deleteContactData(data);
  }


  /**
   * Opens a dialog window with the specified form type.
   * 
   * If the user closes the dialog with the save button, the function will
   * call the getEditContact function to update the contact in the service.
   * 
   * @param formType - The type of form to open in the dialog, such as 'add' or 'edit'.
   */
  openDialog(formType: string): void {
    this.dialog.open(ContactFormComponent, {
      data: [
        { form: formType },
        this.dashboardService.currentContact
      ],
    }).afterClosed().subscribe(result => {
      if (result) {
        this.getEditContact();
      }
    });
  }


  /**
   * Gets the contact with the same ID as the current contact in the service and updates the service's current contact.
   * If the contact is not found, the contactDetailView is set to false.
   */
  getEditContact(): void {
    let editContact = this.apiService.contacts.find(contact => contact.id == this.dashboardService.currentContact.id)
    if (editContact) {
      this.dashboardService.currentContact = editContact;
    } else {
      this.dashboardService.contactDetailView = false;
    }
  }
}
