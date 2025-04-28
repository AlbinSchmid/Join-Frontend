import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ContactsComponent } from './contacts.component';
import { DashboardService } from '../../shared/services/dashboard.service';
import { ApiService } from '../../shared/services/api.service';
import { ContactInterface } from '../../shared/interfaces/contact-interface';

describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;
  let dashboard: DashboardService;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [ContactsComponent],
      providers: [
        DashboardService,
        { provide: ApiService, useValue: apiSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    dashboard = TestBed.inject(DashboardService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit resets categoryLetters and contactDetailView', () => {
    dashboard.contactCategoryLetters = ['X'];
    dashboard.contactDetailView = true;
    component.ngOnInit();
    expect(dashboard.contactCategoryLetters).toEqual([]);
    expect(dashboard.contactDetailView).toBeFalse();
  });

  describe('checkWindowWidth', () => {
    it('returns true when width > 1000', () => {
      component.windowWidth = 1200;
      dashboard.contactDetailView = true;
      expect(component.checkWindowWidth()).toBeTrue();
    });

    it('returns true when width <= 1000 and detailView false', () => {
      component.windowWidth = 800;
      dashboard.contactDetailView = false;
      expect(component.checkWindowWidth()).toBeTrue();
    });

    it('returns false when width <= 1000 and detailView true', () => {
      component.windowWidth = 800;
      dashboard.contactDetailView = true;
      expect(component.checkWindowWidth()).toBeFalse();
    });
  });

  it('closeContactDetail resets currentContact and hides detail', () => {
    dashboard.currentContact = { id: 5, name: 'A', email: '', phone: '', color: '' };
    dashboard.contactDetailView = true;
    component.closeContactDetail();
    expect(dashboard.currentContact.id).toBeNull();
    expect(dashboard.contactDetailView).toBeFalse();
  });

  it('checkIfCategoryIsNeeded adds new letter and returns it', () => {
    component.categoryLetters = [];
    const contact: ContactInterface = { id: 1, name: 'Alice', email: '', phone: '', color: '' };
    const letter = component.checkIfCategoryIsNeeded(contact);
    expect(letter).toBe('A');
    expect(component.categoryLetters).toContain('A');
  });

  it('checkIfCategoryIsNeeded returns undefined if letter exists', () => {
    component.categoryLetters = ['B'];
    const contact: ContactInterface = { id: 2, name: 'Bob', email: '', phone: '', color: '' };
    const letter = component.checkIfCategoryIsNeeded(contact);
    expect(letter).toBeUndefined();
    expect(component.categoryLetters).toEqual(['B']);
  });

  it('openUserDetail sets contactData and showContactDetail true', () => {
    const contact: ContactInterface = { id: 3, name: 'C', email: '', phone: '', color: '' };
    component.openUserDetail(contact);
    expect(component.contactData).toEqual(contact);
    expect(component.showContactDetail).toBeTrue();
  });

  it('openDialog calls dialog.open with correct component and data', () => {
    component.openDialog('add');
    expect(dialogSpy.open).toHaveBeenCalledWith(jasmine.any(Function), { data: [{ form: 'add' }] });
  });
});
