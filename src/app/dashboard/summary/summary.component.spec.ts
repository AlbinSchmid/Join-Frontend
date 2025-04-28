import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { SummaryComponent } from './summary.component';
import { ApiService } from '../../shared/services/api.service';
import { DashboardService } from '../../shared/services/dashboard.service';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let dashboard: DashboardService;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['getUserFormLocalStorage', 'getTaskData']);
    apiSpy.user = { username: '', email: '', token: '', userId: 0 } as any;
    apiSpy.userLogedIn = true;
    await TestBed.configureTestingModule({
      imports: [CommonModule, MatIconModule, SummaryComponent],
      providers: [
        DashboardService,
        DatePipe,
        { provide: ApiService, useValue: apiSpy }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    dashboard = TestBed.inject(DashboardService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit calls user and task methods and sets counts', fakeAsync(() => {
    dashboard.todoAllTasks = [{ prio: 'high' } as any, { prio: 'low' } as any];
    dashboard.inProgressAllTasks = [{ prio: 'high' } as any];
    dashboard.doneAllTasks = [];
    dashboard.awaitFeedback = [];
    component.ngOnInit();
    expect(apiSpy.getUserFormLocalStorage).toHaveBeenCalled();
    expect(apiSpy.getTaskData).toHaveBeenCalled();
    tick(100);
    expect(component.todoCount).toBe(2);
    expect(component.inProgressCount).toBe(1);
    expect(component.doneCount).toBe(0);
    expect(component.awaitingFeedbackCount).toBe(0);
    expect(component.allTaskCount).toBe(3);
    expect(component.urgentCount).toBe(2);
  }));

  it('getUpcomingDeadline returns null when no dates', () => {
    dashboard.todoAllTasks = [];
    dashboard.inProgressAllTasks = [];
    dashboard.doneAllTasks = [];
    dashboard.awaitFeedbackAllTasks = [];
    expect(component.getUpcomingDeadline()).toBeNull();
  });

  it('getUpcomingDeadline returns closest formatted date', () => {
    dashboard.todoAllTasks = [{ date: '2025-04-30' } as any];
    dashboard.inProgressAllTasks = [{ date: '2025-04-25' } as any];
    dashboard.doneAllTasks = [{ date: '2025-04-28' } as any];
    dashboard.awaitFeedbackAllTasks = [];
    const deadline = component.getUpcomingDeadline();
    expect(deadline).toContain('April');
    expect(deadline).toContain('2025');
  });

  it('openBoard toggles flags', () => {
    dashboard.showSummary = true;
    dashboard.showBoard = false;
    component.openBoard();
    expect(dashboard.showBoard).toBeTrue();
    expect(dashboard.showSummary).toBeFalse();
  });

  it('getDates populates allDates', () => {
    const arrays = [
      [{ date: '2025-05-01' } as any],
      [{}, { date: '2025-04-20' } as any]
    ];
    component.getDates(arrays);
    expect(component.allDates.length).toBe(2);
    expect(component.allDates[0]).toEqual(new Date('2025-05-01'));
  });

  describe('getGreetingText', () => {
    afterEach(() => jasmine.clock().uninstall());

    it('returns Good Morning for 8 AM', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2025-04-28T08:00:00'));
      expect(component.getGreetingText()).toBe('Good Morning');
    });

    it('returns Good Afternoon for 13 PM', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2025-04-28T13:00:00'));
      expect(component.getGreetingText()).toBe('Good Afternoon');
    });

    it('returns Good Evening for 19 PM', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2025-04-28T19:00:00'));
      expect(component.getGreetingText()).toBe('Good Evening');
    });

    it('returns Good Night for 23 PM', () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('2025-04-28T23:00:00'));
      expect(component.getGreetingText()).toBe('Good Night');
    });
  });
});
