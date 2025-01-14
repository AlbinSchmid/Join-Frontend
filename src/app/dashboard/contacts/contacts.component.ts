import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { MatDialog } from '@angular/material/dialog';
import { log } from 'node:console';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { DashboardService } from '../../shared/services/dashboard.service';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-contacts',
  imports: [
    MatIconModule,
    ContactDetailComponent
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
  standalone: true
})
export class ContactsComponent {
  dashboardService = inject(DashboardService);
  apiService = inject(ApiService);
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.dashboardService.contacts);
      
    }, 1000);
  }

  openDialog(formType: string) {
    this.dialog.open(ContactFormComponent, {
      data: {form: formType},
    });
  }
}
