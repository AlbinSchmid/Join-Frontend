import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardComponent } from './board.component';
import { DashboardService } from '../../shared/services/dashboard.service';
import { ApiService } from '../../shared/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { of } from 'rxjs';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dashboard: DashboardService;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['getTaskData', 'patchTaskData']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [BoardComponent],
      providers: [
        DashboardService,
        { provide: ApiService, useValue: apiSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    dashboard = TestBed.inject(DashboardService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit calls apiService.getTaskData', () => {
    component.ngOnInit();
    expect(apiSpy.getTaskData).toHaveBeenCalled();
  });

  describe('searchTask', () => {
    beforeEach(() => {
      dashboard.searchTaskInput = 'Ta';
      dashboard.todoAllTasks = [ { title: 'Task1' } as any, { title: 'Other' } as any ];
      dashboard.inProgressAllTasks = [ { title: 'Take off' } as any ];
      dashboard.awaitFeedbackAllTasks = [ { title: 'tasking' } as any ];
      dashboard.doneAllTasks = [ { title: 'done' } as any ];
    });

    it('filters tasks in each category', () => {
      component.searchTask();
      expect(dashboard.todo).toEqual([{ title: 'Task1' } as any]);
      expect(dashboard.inProgress).toEqual([{ title: 'Take off' } as any]);
      expect(dashboard.awaitFeedback).toEqual([{ title: 'tasking' } as any]);
      expect(dashboard.done).toEqual([]);
    });
  });

  describe('openAddTaskDialog', () => {
    it('opens dialog when windowWidth > 1000', () => {
      component.windowWidth = 1200;
      component.openAddTaskDialog();
      expect(dialogSpy.open).toHaveBeenCalledWith(AddTaskDialogComponent);
    });

    it('toggles dashboard flags when windowWidth <= 1000', () => {
      component.windowWidth = 800;
      dashboard.showBoard = true;
      dashboard.showAddTask = false;
      component.openAddTaskDialog();
      expect(dashboard.showBoard).toBeFalse();
      expect(dashboard.showAddTask).toBeTrue();
    });
  });

  describe('drop', () => {
    let todo: any[];
    let inProgress: any[];
    let event: any;

    beforeEach(() => {
      dashboard.todoAllTasks = [ { id: 1 } as any ];
      dashboard.todo = [ { id: 1 } as any ];
      dashboard.inProgressAllTasks = [];
      dashboard.inProgress = [];
      todo = dashboard.todo;
      inProgress = dashboard.inProgress;
    });

    it('does not call patchTaskData when dropped in same container', () => {
      const containerRef = { data: todo };
      const event = {
        previousContainer: containerRef,
        container: containerRef,
        previousIndex: 0,
        currentIndex: 0
      } as CdkDragDrop<any[]>;
      component.drop(event, 'to-do');
      expect(apiSpy.patchTaskData).not.toHaveBeenCalled();
    });

    it('transfers and calls patchTaskData when dropped in different container', () => {
      event = {
        previousContainer: { data: todo },
        container: { data: inProgress },
        previousIndex: 0,
        currentIndex: 0
      } as CdkDragDrop<any[]>;
      component.drop(event, 'in-progress');
      expect(inProgress.length).toBe(1);
      expect(apiSpy.patchTaskData).toHaveBeenCalledWith({ id: 1, taskCategory: 'in-progress' });
    });
  });
});
