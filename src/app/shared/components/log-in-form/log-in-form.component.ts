import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  http = inject(HttpClient);
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
    this.apiService.UserLogedIn = true;
    this.apiService.UserToken = response.token;
    this.dashboardService.showSummary = true;
    this.showLoginFailedError = false;
    this.router.navigate([`dashboard/${response.token}`]);
    this.apiService.userData = response;
    this.resetForm()
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
