import { Component } from '@angular/core';
import { LogInFormComponent } from '../shared/components/log-in-form/log-in-form.component';

@Component({
    selector: 'app-sign-up',
    imports: [LogInFormComponent],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss',
    standalone: true
})
export class SignUpComponent {

}
