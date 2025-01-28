import { Routes } from '@angular/router';
import path from 'node:path';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SummaryComponent } from './dashboard/summary/summary.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrivacyPolicyComponent } from './dashboard/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './dashboard/legal-notice/legal-notice.component';
import { HelpPageComponent } from './dashboard/help-page/help-page.component';

export const routes: Routes = [
    {path: '', component: LogInComponent},
    {path: 'sign-up', component: SignUpComponent},
    {path: 'dashboard', component: DashboardComponent},
];
