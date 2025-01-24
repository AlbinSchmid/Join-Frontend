import { Component, inject } from '@angular/core';
import { LogInFormComponent } from '../shared/components/log-in-form/log-in-form.component';
import { DashboardService } from '../shared/services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sign-up',
    imports: [
        LogInFormComponent,
        CommonModule,
    ],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss',
    standalone: true
})
export class SignUpComponent {
    dashboardService = inject(DashboardService);
}
