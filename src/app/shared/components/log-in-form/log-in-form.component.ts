import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { log } from 'node:console';

@Component({
  selector: 'app-log-in-form',
  imports: [MatButtonModule, MatIconModule, FormsModule, CommonModule],
  templateUrl: './log-in-form.component.html',
  styleUrl: './log-in-form.component.scss',
  standalone: true
})
export class LogInFormComponent {
@Input() formType: string;
fromData = {
  nameValue: '',
  emailValue: '',
  passwordValue: '',
  confirmPasswordValue: '',
  checkboxPrivacyPolicy: false
}
showCheckboxError = false;


goToPreviousPage(): void {
  history.back();
}


submitForm(ngForm: NgForm): void {
  if (ngForm.valid && ngForm.submitted) {
    console.log(ngForm);
  } else {
    this.fromData.checkboxPrivacyPolicy === false ? this.showCheckboxError = true : this.showCheckboxError = false
  }
}
}
