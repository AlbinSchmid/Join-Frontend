import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { ApiService } from '../../../shared/services/api.service';
import { ContactInterface } from '../../../shared/interfaces/contact-interface';

@Component({
  selector: 'app-contact-button',
  imports: [
    CommonModule
  ],
  templateUrl: './contact-button.component.html',
  styleUrl: './contact-button.component.scss'
})
export class ContactButtonComponent {
  dashboardService = inject(DashboardService);
  apiService = inject(ApiService);
  @Input() contact: ContactInterface = {
    id: null,
    name: '',
    email: '',
    phone: '',
    color: ''
  }
  categoryLetter: string;
  showCaterogyLetter = false;


  /**
   * Called when the component is initialized.
   *
   * This function checks if the category letter of the contact is already in the
   * contactCategoryLetters array. If not, it adds the letter to the array and
   * sets the showCaterogyLetter flag to true. It also sets the categoryLetter
   * field to the current category letter.
   */
  ngOnInit(): void {
    let catergoryLetter = this.contact.name.charAt(0).toUpperCase();
    if (!this.dashboardService.contactCategoryLetters.includes(catergoryLetter)) {
      this.dashboardService.contactCategoryLetters.push(catergoryLetter)
      this.showCaterogyLetter = true
      this.categoryLetter = catergoryLetter
    }
  }


  /**
   * Opens the contact detail view and sets the current contact to the contact
   * associated with this button.
   */
  openContactDetailView(): void {
    this.dashboardService.contactDetailView = true;
    this.dashboardService.currentContact = this.contact;
  }
}
