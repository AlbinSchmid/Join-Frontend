import { Routes } from '@angular/router';
import path from 'node:path';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
    {path: '', component: LandingPageComponent}
];
