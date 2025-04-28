import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { ApiService } from '../../../shared/services/api.service';
import { ContactDetailComponent } from './contact-detail.component';
import { ContactFormComponent } from '../contact-form/contact-form.component';

describe('ContactDetailComponent', () => {
  let component: ContactDetailComponent;
  let fixture: ComponentFixture<ContactDetailComponent>;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dashboard: DashboardService;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['deleteContactData']);
    apiSpy.contacts = [];
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [ContactDetailComponent],
      providers: [
        DashboardService,
        { provide: ApiService, useValue: apiSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDetailComponent);
    component = fixture.componentInstance;
    dashboard = TestBed.inject(DashboardService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deleteContact calls apiService.deleteContactData with current contact id', () => {
    dashboard.currentContact = { id: 42, name: '', email: '', phone: '', color: '' } as any;
    component.deleteContact();
    expect(apiSpy.deleteContactData).toHaveBeenCalledWith({ id: 42 });
  });

  it('openDialog opens ContactFormComponent and calls getEditContact on close when result truthy', fakeAsync(() => {
    const formType = 'edit';
    const mockDialogRef = { afterClosed: () => of('ok') };
    dialogSpy.open.and.returnValue(mockDialogRef as any);
    spyOn(component, 'getEditContact');

    component.openDialog(formType);
    tick();

    expect(dialogSpy.open).toHaveBeenCalledWith(ContactFormComponent, {
      data: [
        { form: formType },
        dashboard.currentContact
      ]
    });
    expect(component.getEditContact).toHaveBeenCalled();
  }));

  it('getEditContact updates dashboardService.currentContact when found', () => {
    const contactList = [
      { id: 1, name: 'A', email: '', phone: '', color: '' },
      { id: 2, name: 'B', email: '', phone: '', color: '' }
    ];
    apiSpy.contacts = contactList as any;
    dashboard.currentContact = { id: 2 } as any;

    component.getEditContact();
    expect(dashboard.currentContact).toEqual(contactList[1] as any);
  });

  it('getEditContact sets contactDetailView false when not found', () => {
    apiSpy.contacts = [];
    dashboard.contactDetailView = true;
    dashboard.currentContact = { id: 99 } as any;

    component.getEditContact();
    expect(dashboard.contactDetailView).toBeFalse();
  });
});
