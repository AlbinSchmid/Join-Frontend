import { Component } from '@angular/core';
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    LogInComponent,
    SignUpComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
