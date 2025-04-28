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
  showMessage = false;


  /**
  * Logs in as a guest user.
  */
  guestLogIn(): void {
    const data = {
      "username": "guest",
      "password": "guest"
    }
    this.apiService.postGuestLogInData(data).subscribe((response) => {
      this.logInSuccess(response)
    })
  }

  /**
   * Resets the form fields to their default values.
   */
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

  /**
   * Sends the sign-up request to the API.
   * 
   * @param data - The sign-up data containing username, email, password, and repeated password.
   */
  logInSuccess(response: any): void {
    this.safeUserDataInLocalStorage(response);
    this.apiService.userLogedIn = true;
    this.dashboardService.showSummary = true;
    this.showLoginFailedError = false;
    this.router.navigate(['dashboard']);
    this.apiService.user = response;
    this.resetForm()
  }

  /**
   * Navigates to the previous page.
   */
  safeUserDataInLocalStorage(response: any): void {
    const userData = {
      username: response.username,
      email: response.email,
      token: response.token,
      userId: response.id
    }
    localStorage.setItem('user', JSON.stringify(userData));
  }

  /**
   * Submits the form.
   * 
   * @param ngForm - The form to be submitted.
   */
  sendLogInRequest() {
    const data = {
      "email": this.formData.emailValue,
      "password": this.formData.passwordValue
    }
    this.apiService.postLogInData(data).subscribe((response) => {
      if (response.token === undefined) {
        this.showLoginFailedError = true;
      } else {
        this.logInSuccess(response);
      }
    }, (error) => {
      console.log(error)
    })
  }

  /**
   * Sends the sign-up request to the API.
   */
  sendSingUpRequest() {
    const data = {
      "username": this.formData.nameValue,
      "email": this.formData.emailValue,
      "password": this.formData.passwordValue,
      "repeated_password": this.formData.confirmPasswordValue
    }
    this.apiService.postSingUpData(data).subscribe((response) => {
    }, (error) => {
      console.log(error)
    })
  }

  /**
   * Navigates to the previous page.
   */
  goToPreviousPage(): void {
    this.dashboardService.showStartAnimation = false;
    history.back();
  }

  /**
   * Submits the form.
   * @param ngForm - The form to be submitted.
   */
  submitForm(ngForm: NgForm): void {
    if (ngForm.valid && ngForm.submitted) {
      if (this.formType === 'logIn') {
        this.sendLogInRequest();
      } else if (this.formType === 'signUp') {
        this.sendSingUpRequest();
        this.showErrorAndNavigateToLoginPage();

      }
    } else {
      this.formData.checkboxPrivacyPolicy === false ? this.showCheckboxError = true : this.showCheckboxError = false
    }
  }

  /**
   * Shows an error message and navigates to the login page after a delay.
   */
  showErrorAndNavigateToLoginPage():void {
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
      this.router.navigate(['/']);
    }, 2000);
  }
}
