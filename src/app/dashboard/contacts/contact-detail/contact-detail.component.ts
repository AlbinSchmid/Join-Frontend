import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ContactFormComponent } from '../contact-form/contact-form.component';

@Component({
  selector: 'app-contact-detail',
  imports: [MatIconModule],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss'
})
export class ContactDetailComponent {
  readonly dialog = inject(MatDialog);

  openDialog(formType: string):void {
    this.dialog.open(ContactFormComponent, {
      data: {form: formType},
    });
  }
}
