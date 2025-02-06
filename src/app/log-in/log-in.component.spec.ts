import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LogInComponent } from './log-in.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DashboardService } from '../shared/services/dashboard.service';
import { Router } from '@angular/router';

describe('LogInComponent', () => {
  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;
  let dashboardServiceMok: any;
  let routerMok: any;

  beforeEach(async () => {
    dashboardServiceMok = {
      showStartAnimation: true,
    }

    routerMok = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LogInComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: DashboardService, useValue: dashboardServiceMok },
        { provide: Router, useValue: routerMok }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LogInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('showStartAnimation should be fasle and navigate to /sign-up', fakeAsync(() => {
    component.goToSignUp();
    tick(30);
    expect(component.dashboardService.showStartAnimation).toBeFalse();
    tick(20);
    expect(routerMok.navigate).toHaveBeenCalledWith(['/sign-up']);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
