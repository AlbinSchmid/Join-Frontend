import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { DashboardService } from '../../services/dashboard.service';
import { LogInFormComponent } from './log-in-form.component';

describe('LogInFormComponent', () => {
  let component: LogInFormComponent;
  let fixture: ComponentFixture<LogInFormComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let dashboardService: DashboardService;
  let router: Router;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', [
      'postGuestLogInData', 'postLogInData', 'postSingUpData'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        LogInFormComponent
      ],
      providers: [
        DashboardService,
        { provide: ApiService, useValue: apiSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogInFormComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    dashboardService = TestBed.inject(DashboardService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form data', () => {
    component.formData.nameValue = 'test';
    component.showCheckboxError = true;
    component.resetForm();
    expect(component.formData).toEqual({
      nameValue: '', emailValue: '', passwordValue: '', confirmPasswordValue: '', checkboxPrivacyPolicy: false
    });
    expect(component.showCheckboxError).toBeFalse();
  });

  it('should save user data in localStorage', () => {
    const response = { username: 'u', email: 'e', token: 't', id: 10 };
    component.safeUserDataInLocalStorage(response);
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    expect(stored).toEqual({ username: 'u', email: 'e', token: 't', userId: 10 });
  });

  it('guestLogIn should call postGuestLogInData and logInSuccess', () => {
    const response = { username: 'guest', email: 'g', token: 'tok', id: 1 };
    apiServiceSpy.postGuestLogInData.and.returnValue(of(response));
    spyOn(component, 'logInSuccess');
    component.guestLogIn();
    expect(apiServiceSpy.postGuestLogInData).toHaveBeenCalledWith({ username: 'guest', password: 'guest' });
    expect(component.logInSuccess).toHaveBeenCalledWith(response);
  });

  it('sendLogInRequest success path', () => {
    const response = { token: 'tok', username: 'u', email: 'e', id: 2 };
    apiServiceSpy.postLogInData.and.returnValue(of(response));
    spyOn(component, 'logInSuccess');
    component.formData.emailValue = 'e';
    component.formData.passwordValue = 'p';
    component.sendLogInRequest();
    expect(apiServiceSpy.postLogInData).toHaveBeenCalledWith({ email: 'e', password: 'p' });
    expect(component.logInSuccess).toHaveBeenCalledWith(response);
  });

  it('sendLogInRequest failure sets showLoginFailedError', () => {
    const resp = { other: 'no token' };
    apiServiceSpy.postLogInData.and.returnValue(of(resp));
    component.sendLogInRequest();
    expect(component.showLoginFailedError).toBeTrue();
  });

  it('sendLogInRequest error logs error', () => {
    const error = { status: 500 };
    apiServiceSpy.postLogInData.and.returnValue(throwError(() => error));
    spyOn(console, 'log');
    component.sendLogInRequest();
    expect(console.log).toHaveBeenCalledWith(error);
  });

  it('submitForm login calls sendLogInRequest when valid', () => {
    component.formType = 'logIn';
    const form = { valid: true, submitted: true } as NgForm;
    spyOn(component, 'sendLogInRequest');
    component.submitForm(form);
    expect(component.sendLogInRequest).toHaveBeenCalled();
  });

  it('submitForm signup calls sendSingUpRequest and showErrorAndNavigateToLoginPage', fakeAsync(() => {
    component.formType = 'signUp';
    const form = { valid: true, submitted: true } as NgForm;
    spyOn(component, 'sendSingUpRequest');
    spyOn(component, 'showErrorAndNavigateToLoginPage');
    component.submitForm(form);
    expect(component.sendSingUpRequest).toHaveBeenCalled();
    expect(component.showErrorAndNavigateToLoginPage).toHaveBeenCalled();
  }));

  it('showErrorAndNavigateToLoginPage shows message and navigates after timeout', fakeAsync(() => {
    spyOn(router, 'navigate');
    component.showErrorAndNavigateToLoginPage();
    expect(component.showMessage).toBeTrue();
    tick(2000);
    expect(component.showMessage).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  }));
});
