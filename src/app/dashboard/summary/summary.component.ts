import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../shared/services/api.service';
import { DashboardService } from '../../shared/services/dashboard.service';

@Component({
  selector: 'app-summary',
  imports: [MatIconModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
apiService = inject(ApiService);
dashbaordService = inject(DashboardService);
}
