import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { DashboardService } from './dashboard.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let dashboardService: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    dashboardService = TestBed.inject(DashboardService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should fetch all users via GET', () => {
    const dummy = [{ id: 1, name: 'User1' }];
    service.getAllUser().subscribe(data => {
      expect(data).toEqual(dummy);
    });
    const req = httpMock.expectOne('http://127.0.0.1:8000/api/user-profile/');
    expect(req.request.method).toBe('GET');
    req.flush(dummy);
  });

  it('should delete user via DELETE', () => {
    service.deleteUsers(2).subscribe();
    const req = httpMock.expectOne('http://127.0.0.1:8000/api/user-profile/2/');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should store user and set userLogedIn', () => {
    const usr = { userId: 5, username: 'u', email: 'e', token: 't' };
    localStorage.setItem('user', JSON.stringify(usr));
    service.getUserFormLocalStorage();
    expect(service.user).toEqual(usr);
    expect(service.userLogedIn).toBeTrue();
  });

  it('should post login data', () => {
    const payload = { a: 1 };
    service.postLogInData(payload).subscribe(data => expect(data).toEqual(payload));
    const req = httpMock.expectOne('http://127.0.0.1:8000/api/logIn/');
    expect(req.request.method).toBe('POST');
    req.flush(payload);
  });

  it('should post guest login data', () => {
    const payload = { b: 2 };
    service.postGuestLogInData(payload).subscribe(data => expect(data).toEqual(payload));
    const req = httpMock.expectOne('http://127.0.0.1:8000/api/guest-login/');
    expect(req.request.method).toBe('POST');
    req.flush(payload);
  });

  it('should post sign up data', () => {
    const payload = { c: 3 };
    service.postSingUpData(payload).subscribe(data => expect(data).toEqual(payload));
    const req = httpMock.expectOne('http://127.0.0.1:8000/api/signUp/');
    expect(req.request.method).toBe('POST');
    req.flush(payload);
  });

  it('should post generic request', () => {
    const payload = { d: 4 };
    service.postRequest(payload, 'test-endpoint').subscribe(data => expect(data).toEqual(payload));
    const req = httpMock.expectOne('http://127.0.0.1:8000/api/test-endpoint/');
    expect(req.request.method).toBe('POST');
    req.flush(payload);
  });
});
