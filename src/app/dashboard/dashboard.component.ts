import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { SummaryComponent } from './summary/summary.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { DashboardService } from '../shared/services/dashboard.service';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts/contacts.component';
import { BoardComponent } from './board/board.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatIconModule,
    MatMenuModule,
    SummaryComponent,
    AddTaskComponent,
    CommonModule,
    ContactsComponent,
    BoardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
dashboardService = inject(DashboardService)

switchContent(content: string):void {
  if (content === 'summary') {
    this.dashboardService.showSummary = true
    this.dashboardService.showAddTask = false
    this.dashboardService.showBoard = false
    this.dashboardService.showContacts = false
  } else if (content === 'addTask') {
    this.dashboardService.showSummary = false
    this.dashboardService.showAddTask = true
    this.dashboardService.showBoard = false
    this.dashboardService.showContacts = false
  } else if (content === 'board') {
    this.dashboardService.showSummary = false
    this.dashboardService.showAddTask = false
    this.dashboardService.showBoard = true
    this.dashboardService.showContacts = false
  } else if (content === 'contacts') {
    this.dashboardService.showSummary = false
    this.dashboardService.showAddTask = false
    this.dashboardService.showBoard = false
    this.dashboardService.showContacts = true
  }
}
}
