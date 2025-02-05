import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailDialogComponent } from './task-detail-dialog.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('TaskDetailDialogComponent', () => {
  let component: TaskDetailDialogComponent;
  let fixture: ComponentFixture<TaskDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailDialogComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { contacts: [] } }
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
});
