import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TaskCardComponent } from './task-card.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { ApiService } from '../../../shared/services/api.service';

const mockApiService = {
  getTaskData: jasmine.createSpy('getTaskData'),
  getSubtaskData: jasmine.createSpy('getSubtaskData').and.returnValue(of([
    { id: 1, substasks: [{ completed: true }, { completed: false }] }
  ]))
};

const mockDashboardService = {
  editTask: true
};

const mockDialogRef = {
  afterClosed: () => of('dialog closed')
}

const mockDialog = {
  open: jasmine.createSpy('open').and.returnValue(mockDialogRef)
}

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: ApiService, useValue: mockApiService },
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: MatDialog, useValue: mockDialog }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set subtaskValue and call calculateProgress', () => {
    component.subtasks = [{}, {}, {}];
    spyOn(component, 'calculateProgress');
    component.ngOnInit();
    expect(component.subtaskValue).toBe(3);
    expect(component.calculateProgress).toHaveBeenCalled();
  })

  it('should correctly calculate progress when some subtasks are completed', () => {
    component.subtasks = [{ completed: true }, { completed: false }, { completed: true }, { completed: false }];
    component.calculateProgress();

    expect(component.completeSubtasksValue).toBe(2);
    expect(component.progressbarValue).toBe(50);
  })

  it('should open the dialog with the correct data', () => {
    component.task = { id: 1, title: 'Test Task' } as any;

    // Dialog öffnen
    component.openTaskDetailDialog(component.task);

    // Erwartung: Dialog wurde geöffnet
    expect(mockDialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
      data: { task: component.task }
    });
  });

  it('should call API services after dialog is closed', fakeAsync(() => {
    component.task = {id: 1} as any;
    component.openTaskDetailDialog({ title: 'Task 1', id: 1} as any);

    // Simuliere das Schließen des Dialogs
    tick();

    // Erwartung: API-Aufrufe wurden getätigt
    expect(mockApiService.getTaskData).toHaveBeenCalled();
    expect(mockApiService.getSubtaskData).toHaveBeenCalled();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
