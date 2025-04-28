import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { DashboardService } from '../../services/dashboard.service';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { AddTaskFormComponent } from './add-task-form.component';
import { CommonModule } from '@angular/common';

describe('AddTaskFormComponent', () => {
  let component: AddTaskFormComponent;
  let fixture: ComponentFixture<AddTaskFormComponent>;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let dashboard: DashboardService;
  let datePipe: DatePipe;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', [
      'postRequest', 'patchTaskData', 'patchTaskDataContacts'
    ]);
    apiSpy.contacts = [];
    apiSpy.user = { username: '', email: '', token: '', userId: 1 } as any;

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        CommonModule,
        MatSelectModule,
        MatFormFieldModule,
        MatMenuModule,
        MatIconModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        AddTaskFormComponent
      ],
      providers: [
        DashboardService,
        DatePipe,
        { provide: ApiService, useValue: apiSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTaskFormComponent);
    component = fixture.componentInstance;
    dashboard = TestBed.inject(DashboardService);
    datePipe = TestBed.inject(DatePipe);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize allContacts from apiService', () => {
    apiSpy.contacts = [{ id: 1, name: 'A' } as any];
    component.ngOnInit();
    expect(component.allContacts.length).toBe(1);
    expect(component.allContacts[0].name).toBe('A');
  });

  it('getEditTaskData should populate form and subtasks', () => {
    const mockTask = {
      id: 5,
      title: 'T',
      description: 'D',
      prio: 'high',
      date: '2025-04-01',
      category: 'User Story',
      subtasks: [{ id: 1, title: 'S', completed: false }],
      contacts: [{ id: 2, name: 'C', email: '', phone: '', color: '' }]
    } as any;
    component.task = mockTask;
    component.getEditTaskData();
    expect(component.addTaskForm.title).toBe('T');
    expect(component.createdSubtasks.length).toBe(1);
    expect(component.editAssingedContact.length).toBe(1);
  });

  it('submitEditTaskForm calls saveEditTask when valid', () => {
    const form = { valid: true, submitted: true } as NgForm;
    spyOn(component, 'saveEditTask');
    component.submitEditTaskForm(form);
    expect(component.saveEditTask).toHaveBeenCalled();
  });

  it('createTask posts data and resets form', fakeAsync(() => {
    const response = { id: 10 };
    spyOn(component, 'resestForm');
    spyOn(component, 'closeDialog');
    apiSpy.postRequest.and.returnValue(of(response));
    component.createTask();
    tick();
    expect(apiSpy.postRequest).toHaveBeenCalled();
    expect(dashboard.todo.includes(response)).toBeTrue();
    expect(component.resestForm).toHaveBeenCalled();
    expect(component.closeDialog).toHaveBeenCalled();
  }));

  it('saveEditTask calls patch methods and emits closeFormDialog', fakeAsync(() => {
    spyOn(component.closeFormDialog, 'emit');
    component.task = { id: 7, subtasks: [], contacts: [] } as any;
    component.addTaskForm = { date: new Date(), title: '', description: '', prio: 'low', category: '' } as any;
    component.editAssingedContact = [];
    component.createdSubtasks = [];
    component.saveEditTask();
    expect(apiSpy.patchTaskData).toHaveBeenCalled();
    tick(10);
    expect(apiSpy.patchTaskDataContacts).toHaveBeenCalled();
    expect(component.closeFormDialog.emit).toHaveBeenCalled();
  }));
});
