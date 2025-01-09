import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LogInFormComponent } from '../shared/components/log-in-form/log-in-form.component';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../shared/services/api.service';
import { error } from 'console';


@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrl: './log-in.component.scss',
    imports: [
        LogInFormComponent,
        MatButtonModule
    ],
    standalone: true
})
export class LogInComponent {
}
