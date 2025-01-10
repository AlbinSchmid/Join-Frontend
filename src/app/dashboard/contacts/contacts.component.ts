import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { MatDialog } from '@angular/material/dialog';
import { log } from 'node:console';

@Component({
  selector: 'app-contacts',
  imports: [MatIconModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
  standalone: true
})
export class ContactsComponent {
  readonly dialog = inject(MatDialog);

  openDialog(formType: string) {
    this.dialog.open(ContactFormComponent, {
      data: {form: formType},
    });
  }
}
