import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { TaskInterface } from '../interfaces/task-interface';

describe('DashboardService', () => {
  let service: DashboardService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(DashboardService);
  });

  it('should return empty string for empty name', () => {
    expect(service.getInitials('')).toBe('');
  });

  it('should return initials for single word', () => {
    expect(service.getInitials('Alice')).toBe('A');
  });

  it('should return initials for multiple words', () => {
    expect(service.getInitials('Alice Bob Charlie')).toBe('ABC');
  });

  it('should return high priority icon', () => {
    const task: TaskInterface = { prio: 'high' } as any;
    expect(service.controllPrio(task)).toBe('keyboard_double_arrow_up');
  });

  it('should return medium priority icon', () => {
    const task: TaskInterface = { prio: 'medium' } as any;
    expect(service.controllPrio(task)).toBe('drag_handle');
  });

  it('should return low priority icon for others', () => {
    const task: TaskInterface = { prio: 'low' } as any;
    expect(service.controllPrio(task)).toBe('keyboard_double_arrow_down');
  });

  it('should show privacy policy and navigate', () => {
    service.goToPrivacyPolicyOrLegalNotice('privacyPolicy');
    expect(service.showPrivacyPolicy).toBeTrue();
    expect(service.showLegalNotice).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show legal notice and navigate', () => {
    service.goToPrivacyPolicyOrLegalNotice('legalNotice');
    expect(service.showLegalNotice).toBeTrue();
    expect(service.showPrivacyPolicy).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});