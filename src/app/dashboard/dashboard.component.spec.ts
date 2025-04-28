import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../shared/services/dashboard.service';
import { ApiService } from '../shared/services/api.service';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;
  let dashboardService: DashboardService;
  let apiSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', [
      'getUserFormLocalStorage', 'getContactData', 'deleteUsers'
    ]);
    apiSpy.userLogedIn = false;
    apiSpy.user = { username: '', email: '', token: '', userId: 0 };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), DashboardComponent],
      providers: [
        DashboardService,
        { provide: ApiService, useValue: apiSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    dashboardService = TestBed.inject(DashboardService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit calls getUserFormLocalStorage and conditionally getContactData', fakeAsync(() => {
    apiSpy.userLogedIn = true;
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    apiSpy.getContactData.calls.reset();
    component.ngOnInit();
    expect(apiSpy.getUserFormLocalStorage).toHaveBeenCalled();
    tick(10);
    expect(apiSpy.getContactData).toHaveBeenCalled();
  }));

  it('switchContent calls appropriate methods', () => {
    spyOn(component, 'goToSummary');
    spyOn(component, 'goToAddTask');
    spyOn(component, 'goToBoard');
    spyOn(component, 'goToContacts');
    spyOn(component, 'goToPrivacyPolicy');
    spyOn(component, 'goToLegalNotice');
    spyOn(component, 'goToHelp');

    component.switchContent('summary');
    expect(component.goToSummary).toHaveBeenCalled();
    component.switchContent('addTask');
    expect(component.goToAddTask).toHaveBeenCalled();
    component.switchContent('board');
    expect(component.goToBoard).toHaveBeenCalled();
    component.switchContent('contacts');
    expect(component.goToContacts).toHaveBeenCalled();
    component.switchContent('privacyPolicy');
    expect(component.goToPrivacyPolicy).toHaveBeenCalled();
    component.switchContent('legalNotice');
    expect(component.goToLegalNotice).toHaveBeenCalled();
    component.switchContent('help');
    expect(component.goToHelp).toHaveBeenCalled();
  });

  it('goToLogIn navigates and resets flags', () => {
    spyOn(router, 'navigate');
    dashboardService.showSummary = true;
    dashboardService.showAddTask = true;
    dashboardService.showBoard = true;
    dashboardService.showContacts = true;

    component.goToLogIn();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(dashboardService.showSummary).toBeFalse();
    expect(dashboardService.showAddTask).toBeFalse();
    expect(dashboardService.showBoard).toBeFalse();
    expect(dashboardService.showContacts).toBeFalse();
  });

  it('navigation methods set correct flags', () => {
    component.goToSummary();
    expect(dashboardService.showSummary).toBeTrue();
    expect(dashboardService.showAddTask).toBeFalse();

    component.goToAddTask();
    expect(dashboardService.showAddTask).toBeTrue();
    expect(dashboardService.showBoard).toBeFalse();

    component.goToBoard();
    expect(dashboardService.showBoard).toBeTrue();
    expect(dashboardService.searchTaskInput).toBe('');

    component.goToContacts();
    expect(dashboardService.showContacts).toBeTrue();
    expect(dashboardService.currentContact.id).toBe(0);
  });

  it('info page methods clear others and set flags', () => {
    component.goToHelp();
    expect(dashboardService.showHelpPage).toBeTrue();
    expect(dashboardService.showPrivacyPolicy).toBeFalse();

    component.goToPrivacyPolicy();
    expect(dashboardService.showPrivacyPolicy).toBeTrue();
    expect(dashboardService.showLegalNotice).toBeFalse();

    component.goToLegalNotice();
    expect(dashboardService.showLegalNotice).toBeTrue();
    expect(dashboardService.showHelpPage).toBeFalse();
  });

  it('logout clears storage, resets user and navigates', () => {
    spyOn(localStorage, 'clear');
    spyOn(component, 'resetUser');
    spyOn(router, 'navigate');
    apiSpy.user.username = 'guest';
    apiSpy.user.userId = 42;
    apiSpy.deleteUsers.and.returnValue(of({}));

    component.logout();

    expect(localStorage.clear).toHaveBeenCalled();
    expect(apiSpy.userLogedIn).toBeFalse();
    expect(component.resetUser).toHaveBeenCalled();
    expect(apiSpy.deleteUsers).toHaveBeenCalledWith(42);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
