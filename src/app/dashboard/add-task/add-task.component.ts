import { Component, inject } from '@angular/core';
import { AddTaskFormComponent } from '../../shared/components/add-task-form/add-task-form.component';
import { ApiService } from '../../shared/services/api.service';
import { DashboardService } from '../../shared/services/dashboard.service';

@Component({
  selector: 'app-add-task',
  imports: [AddTaskFormComponent],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
apiService = inject(ApiService);
dashboardService = inject(DashboardService);
}
