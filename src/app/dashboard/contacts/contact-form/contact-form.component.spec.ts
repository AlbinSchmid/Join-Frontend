import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ContactFormComponent } from './contact-form.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../shared/services/api.service';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { of } from 'rxjs';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ContactFormComponent>>;

  const mockData = [
    { form: 'add' },
    { id: 1, name: 'Test', email: 'test@example.com', phone: '1234' }
  ];

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'deleteContactData', 'postRequest', 'relaodContact', 'sortContacts', 'patchContactData'
    ]);
    apiServiceSpy.contacts = [];
    const dialogCloseSpy = jasmine.createSpy('close');
    dialogRefSpy = { close: dialogCloseSpy } as any;

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, MatIconModule, MatButtonModule, ContactFormComponent],
      providers: [
        DashboardService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit initializes formData when data length > 1', () => {
    component.ngOnInit();
    expect(component.formData.nameContact).toBe('Test');
    expect(component.formData.emailContact).toBe('test@example.com');
    expect(component.formData.phoneContact).toBe('1234');
  });

  it('closeDialog closes with add action', () => {
    component.closeDialog();
    expect(dialogRefSpy.close).toHaveBeenCalledWith('add');
  });

  it('deleteContact calls apiService.deleteContactData, filters contacts, and closes with delete', () => {
    apiServiceSpy.contacts = [{ id: 1 } as any, { id: 2 } as any];
    component.deleteContact();
    expect(apiServiceSpy.deleteContactData).toHaveBeenCalledWith({ id: 1 });
    expect(apiServiceSpy.contacts).toEqual([{ id: 2 } as any]);
    expect(dialogRefSpy.close).toHaveBeenCalledWith('delete');
  });

  it('createRandomColor returns hex string of length 7', () => {
    const color = component.createRandomColor();
    expect(color).toMatch(/^#[0-9A-F]{6}$/);
  });

  it('createContact posts data and handles response', fakeAsync(() => {
    const response = { id: 3 };
    spyOn(component, 'handleResponse');
    apiServiceSpy.user = { userId: 1 } as any;
    apiServiceSpy.postRequest.and.returnValue(of(response));

    component.formData = { nameContact: 'A', emailContact: 'e', phoneContact: 'p' };
    component.createContact();
    tick();
    expect(apiServiceSpy.postRequest).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'A', email: 'e', phone: 'p' }), 'contact');
    expect(component.handleResponse).toHaveBeenCalledWith(response);
  }));

  it('handleResponse updates contacts, reloads, sorts, and closes', () => {
    spyOn(component, 'closeDialog');
    apiServiceSpy.contacts = [];
    component.handleResponse({ id: 4 } as any);
    expect(apiServiceSpy.contacts.some(contact => contact.id === 4)).toBeTrue();
    expect(apiServiceSpy.relaodContact).toHaveBeenCalled();
    expect(apiServiceSpy.sortContacts).toHaveBeenCalled();
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('updateContact patches data and closes with edit', () => {
    component.formData = { nameContact: 'B', emailContact: 'e2', phoneContact: 'p2' };
    component.updateContact();
    expect(apiServiceSpy.patchContactData).toHaveBeenCalledWith({ id: 1, name: 'B', email: 'e2', phone: 'p2' });
    expect(dialogRefSpy.close).toHaveBeenCalledWith('edit');
  });

  it('submitForm calls createContact only when valid and form is add', () => {
    const createSpy = spyOn(component, 'createContact');
    const form = { valid: true, submitted: true } as any;
    component.submitForm(form);
    expect(createSpy).toHaveBeenCalled();
    createSpy.calls.reset();
    component.data[0].form = 'edit';
    component.submitForm(form);
    expect(createSpy).not.toHaveBeenCalled();
  });
});
