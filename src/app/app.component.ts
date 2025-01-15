import { Component, inject, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './shared/services/api.service';
import { log } from 'console';
import { DashboardService } from './shared/services/dashboard.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  dashboardService = inject(DashboardService)
  apiService = inject(ApiService)
  title = 'join-front-end';

  ngOnInit(): void {
    this.getUserFormLocalStorage();
    this.apiService.getContactData();
  }


  getUserFormLocalStorage():void {
    const storedUser = JSON.parse(localStorage.getItem('user') ?? '{}');
    this.apiService.user = storedUser
  }
}
