import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../shared/services/api.service';
import { DashboardService } from '../../shared/services/dashboard.service';
import { TaskInterface } from '../../shared/interfaces/task-interface';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-summary',
  providers: [DatePipe], 
  imports: [MatIconModule, CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  apiService = inject(ApiService);
  dashbaordService = inject(DashboardService);
  datePipe = inject(DatePipe);
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  allTaskCount: number;
  awaitingFeedbackCount: number;
  urgentCount: number;
  upcomingDeadline: string | null;
  allDates: Date[] = [];

  /**
   * Initializes the component upon creation.
   * 
   * Logs the task information to the console. If the form type is 'editTask',
   * it retrieves the task data for editing. It also fetches all available
   * contacts for assignment.
   */
  ngOnInit() {
    this.apiService.getUserFormLocalStorage();
    this.apiService.getTaskData();
    setTimeout(() => {
      this.todoCount = this.dashbaordService.todoAllTasks.length;
      this.inProgressCount = this.dashbaordService.inProgressAllTasks.length;
      this.doneCount = this.dashbaordService.doneAllTasks.length;
      this.awaitingFeedbackCount = this.dashbaordService.awaitFeedback.length;
      this.allTaskCount = this.todoCount + this.inProgressCount + this.doneCount + this.awaitingFeedbackCount;
      this.urgentCount = this.getUrgentCount();
      this.upcomingDeadline = this.getUpcomingDeadline();
    }, 100);
  }


  /**
   * Retrieves the username from the `apiService` and formats it by capitalizing the first letter.
   *
   * @returns {string} The formatted username with the first letter capitalized.
   */
  getName(): string {
    return this.apiService.user.username.charAt(0).toUpperCase() + this.apiService.user.username.slice(1);
  }

  
  /**
   * Gets the total count of tasks with priority 'high' from the service.
   * 
   * @returns The count of tasks with priority 'high'.
   */
  getUrgentCount(): number {
    return this.dashbaordService.todoAllTasks.filter((task) => task.prio === 'high').length +
      this.dashbaordService.inProgressAllTasks.filter((task) => task.prio === 'high').length +
      this.dashbaordService.doneAllTasks.filter((task) => task.prio === 'high').length +
      this.dashbaordService.awaitFeedback.filter((task) => task.prio === 'high').length;
  }


  /**
   * Finds the closest deadline from all tasks in all categories.
   * 
   * @returns The closest deadline as a string in the format 'MMMM d,yyyy' or null if no tasks have a deadline.
   */
  getUpcomingDeadline(): string | null{
    let jsonArrays: TaskInterface[][] = [
      this.dashbaordService.awaitFeedbackAllTasks,
      this.dashbaordService.doneAllTasks,
      this.dashbaordService.inProgressAllTasks,
      this.dashbaordService.todoAllTasks
    ];
    this.getDates(jsonArrays);
    if (this.allDates.length === 0) {  
      return null;  
    }  
    const closestDate = this.allDates.reduce((a, b) => (a < b ? a : b));  
    let formattedDate = this.datePipe.transform(closestDate, 'MMMM d,yyyy') as string;  
    return formattedDate; // Gibt das Datum als String zurück  
  }


  /**
   * Opens the board and hides the summary.
   */
  openBoard(): void {
    this.dashbaordService.showBoard = true;
    this.dashbaordService.showSummary = false;
  }

  
  /**
   * Iterates over each array in the given 2D array of TaskInterfaces, and pushes
   * the task dates to the allDates array if the task has a date set.
   * 
   * @param jsonArrays The 2D array of TaskInterfaces to iterate over.
   */
  getDates(jsonArrays: TaskInterface[][]): void {
    jsonArrays.forEach(array => {
      array.forEach(task => {
        if (task.date) {
          this.allDates.push(new Date(task.date));
        }
      });
    });
  }
}
