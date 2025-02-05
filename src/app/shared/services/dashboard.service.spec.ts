import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { HttpClient } from '@angular/common/http';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      
    });
    service = TestBed.inject(DashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
