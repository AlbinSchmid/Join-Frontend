import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { DashboardService } from '../../services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in-form',
  imports: [MatButtonModule, MatIconModule, FormsModule, CommonModule],
  templateUrl: './log-in-form.component.html',
  styleUrl: './log-in-form.component.scss',
  standalone: true
})
export class LogInFormComponent {
  apiService = inject(ApiService);
  dashboardService = inject(DashboardService);
  router = inject(Router);

  @Input() formType: string;

  formData = {
    nameValue: '',
    emailValue: '',
    passwordValue: '',
    confirmPasswordValue: '',
    checkboxPrivacyPolicy: false
  }
  showCheckboxError = false;
  showLoginFailedError = false;


  resetForm(): void {
    this.formData = {
      nameValue: '',
      emailValue: '',
      passwordValue: '',
      confirmPasswordValue: '',
      checkboxPrivacyPolicy: false
    }
    this.showCheckboxError = false
  }


  LogInSuccess(response: any): void {
    this.safeUserDataInLocalStorage(response);
    this.apiService.userLogedIn = true;
    this.dashboardService.showSummary = true;
    this.showLoginFailedError = false;
    this.router.navigate(['dashboard']);
    this.apiService.user = response;
    this.resetForm()
  }

  safeUserDataInLocalStorage(response: any): void {
    const userData = {
      username: response.username,
      email: response.email,
      token: response.token,
      userId : response.id
    }
    localStorage.setItem('user', JSON.stringify(userData));
  }


  sendLogInRequest() {
    const data = {
      "email": this.formData.emailValue,
      "password": this.formData.passwordValue
    }
    this.apiService.postLogInData(data).subscribe((response) => {
      if (response.token === undefined) {
        this.showLoginFailedError = true;
      } else {
        this.LogInSuccess(response);
      }
    }, (error) => {
      console.log(error)
    })
  }

  sendSingUpRequest() {
    const data = {
      "username": this.formData.nameValue,
      "email": this.formData.emailValue,
      "password": this.formData.passwordValue,
      "repeated_password": this.formData.confirmPasswordValue
    }
    this.apiService.postSingUpData(data).subscribe((response) => {
      console.log(response)
    }, (error) => {
      console.log(error)
    })
  }


  goToPreviousPage(): void {
    history.back();
  }


  submitForm(ngForm: NgForm): void {
    if (ngForm.valid && ngForm.submitted) {
      if (this.formType === 'logIn') {
        this.sendLogInRequest();
      } else if (this.formType === 'signUp') {
        this.sendSingUpRequest();
      }
      console.log(ngForm);
    } else {
      this.formData.checkboxPrivacyPolicy === false ? this.showCheckboxError = true : this.showCheckboxError = false
    }
  }
}
