import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-summary',
  imports: [MatIconModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
apiService = inject(ApiService)
}
