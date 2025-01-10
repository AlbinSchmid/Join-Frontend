import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-add-contact',
  imports: [
    MatIconModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  standalone: true
})
export class ContactFormComponent {
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
}
