import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../shared/services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { log } from 'console';
import { DashboardService } from '../../../shared/services/dashboard.service';


@Component({
  selector: 'app-add-contact',
  imports: [
    MatIconModule,
    MatButtonModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  standalone: true
})
export class ContactFormComponent {
  dashboardService = inject(DashboardService);
  apiService = inject(ApiService);
  dialogRef = inject(MatDialogRef<ContactFormComponent>);
  data = inject<any>(MAT_DIALOG_DATA);
  formData = {
    nameContact: '',
    emailContact: '',
    phoneContact: '',
  }

  closeDialog() {
    this.dialogRef.close();
  }

  createContact() {
    const data = {
      "name": this.formData.nameContact,
      "email": this.formData.emailContact,
      "phone": this.formData.phoneContact,
      "user_id": this.apiService.userData.userId
    }
    this.apiService.postContactData(data).subscribe((response) => {
      this.dashboardService.contacts.push(response);
      this.closeDialog();
    }, (error) => {
      console.error(error);
    })
  }

  submitForm(ngForm: any) {
    console.log(ngForm);
    if (ngForm.valid && ngForm.submitted) {
      this.createContact();
    }
  }
}
