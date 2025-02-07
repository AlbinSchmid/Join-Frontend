import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskDialogComponent } from './add-task-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AddTaskDialogComponent', () => {
  let component: AddTaskDialogComponent;
  let fixture: ComponentFixture<AddTaskDialogComponent>;
  let dialogRefMok: jasmine.SpyObj<MatDialogRef<AddTaskDialogComponent>>;

  beforeEach(async () => {

    dialogRefMok = jasmine.createSpyObj<MatDialogRef<AddTaskDialogComponent>>('MatDialogRef', ['close']);


    await TestBed.configureTestingModule({
      imports: [AddTaskDialogComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: MatDialogRef, useValue: dialogRefMok }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should close add task dialog', () => {
    component.closeDialog();

    expect(dialogRefMok.close).toHaveBeenCalled();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
