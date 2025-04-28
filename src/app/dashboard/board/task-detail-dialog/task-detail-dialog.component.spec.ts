import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskDetailDialogComponent } from './task-detail-dialog.component';
import { ApiService } from '../../../shared/services/api.service';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { DatePipe } from '@angular/common';

describe('TaskDetailDialogComponent', () => {
  let component: TaskDetailDialogComponent;
  let fixture: ComponentFixture<TaskDetailDialogComponent>;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<TaskDetailDialogComponent>>;
  let data: any;

  const mockTask = {
    id: 10,
    contacts: [{ id: 1, name: 'C1', email: '', phone: '', color: '' }],
    subtasks: [{ id: 2, title: 'S1', completed: false }]
  } as any;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['patchSubtaskData', 'deleteTaskData']);
    apiSpy.patchSubtaskData.and.returnValue(of({}));

    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    data = { task: mockTask };

    await TestBed.configureTestingModule({
      imports: [TaskDetailDialogComponent],
      providers: [
        DatePipe,
        DashboardService,
        { provide: ApiService, useValue: apiSpy },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize task data', () => {
    expect(component).toBeTruthy();
    expect(component.task).toEqual(mockTask);
    expect(component.contacts).toEqual(mockTask.contacts);
    expect(component.subtasks).toEqual(mockTask.subtasks);
  });

  it('ngOnInit updates properties from data', () => {
    component.task = {} as any;
    component.contacts = [];
    component.subtasks = [];
    component.ngOnInit();
    expect(component.task).toEqual(mockTask);
    expect(component.contacts).toEqual(mockTask.contacts);
    expect(component.subtasks).toEqual(mockTask.subtasks);
  });

  it('setSubtaskToCompleted toggles and calls patchSubtaskData', fakeAsync(() => {
    const sub = { id: 2, completed: false } as any;
    component.setSubtaskToCompleted(sub);
    tick();
    expect(apiSpy.patchSubtaskData).toHaveBeenCalledWith({ id: 2, completed: true });
  }));

  it('deleteTask calls deleteTaskData and closes dialog', () => {
    component.deleteTask();
    expect(apiSpy.deleteTaskData).toHaveBeenCalledWith({ id: 10 });
    expect(dialogRefSpy.close).toHaveBeenCalledWith(component.subtasks);
  });

  describe('firstLetterBig', () => {
    it('returns empty string on falsy input', () => {
      expect(component.firstLetterBig('')).toBe('');
    });
    it('capitalizes first letter', () => {
      expect(component.firstLetterBig('high')).toBe('High');
    });
  });

  it('closeTaskDetailDialog closes with subtasks', () => {
    component.closeTaskDetailDialog();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(component.subtasks);
  });
});
