import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { LogInFormComponent } from '../shared/components/log-in-form/log-in-form.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../shared/services/dashboard.service';



@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrl: './log-in.component.scss',
    imports: [
        LogInFormComponent,
        MatButtonModule,
        CommonModule,
        RouterModule,
    ],
    standalone: true
})
export class LogInComponent {
    dashboardService = inject(DashboardService);
    router = inject(Router);

    public throwTestError(): void {
        throw new Error("Das ist ein Testfehler!");
    }

    /**
     * Navigates the user to the sign-up page.
     * 
     * This method first disables the start animation on the dashboard service,
     * then waits for 50 milliseconds before navigating to the '/sign-up' route.
     */
    goToSignUp(): void {
        this.dashboardService.showStartAnimation = false;
        setTimeout(() => {
            this.router.navigate(['/sign-up']);
        }, 50);
    }
}
