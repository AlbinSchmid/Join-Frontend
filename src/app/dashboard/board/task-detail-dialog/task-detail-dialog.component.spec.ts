import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailDialogComponent } from './task-detail-dialog.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';

const mockApiService = {
  patchSubtaskData: jasmine.createSpy('patchSubtaskData').and.returnValue(of({ success: true }))
};

describe('TaskDetailDialogComponent', () => {
  let component: TaskDetailDialogComponent;
  let fixture: ComponentFixture<TaskDetailDialogComponent>;

  const mockDataWithTask = {
    task: {
      title: 'Test Task',
      id: 1,
      description: 'Test description',
      prio: 'high',
      status: 'open',
      user: 'John Doe',
      date: '2024-01-01',
      category: 'Work',
      taskCategory: 'Development',
      contacts: [
        { id: 1, name: 'Alice', email: 'alice@example.com', phone: '123-456-7890', color: 'blue' },
        { id: 2, name: 'Bob', email: 'bob@example.com', phone: '987-654-3210', color: 'green' }
      ],
      subtasks: [
        { id: 1, title: 'Subtask 1', completed: false }, // ✅ Alle erforderlichen Felder
        { id: 2, title: 'Subtask 2', completed: true }
      ]
    }
  };



  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailDialogComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { task: { contacts: [], subtasks: [] } } },
        { provide: ApiService, useValue: mockApiService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize task', () => {
    component.data = mockDataWithTask;
    component.ngOnInit();

    expect(component.task).toEqual(mockDataWithTask.task);
    expect(component.contacts).toEqual(mockDataWithTask.task.contacts);
    expect(component.subtasks).toEqual(mockDataWithTask.task.subtasks);
  })

  it('should set subtask to completed', () => {
    const subtask = { id: 1, completed: false };
    component.setSubtaskToCompleted(subtask);

    expect(mockApiService.patchSubtaskData).toHaveBeenCalledWith({ id: 1, completed: true });
  });
});
