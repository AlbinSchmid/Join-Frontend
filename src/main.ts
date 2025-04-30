import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import * as Sentry from "@sentry/angular";

Sentry.init({
  dsn: "https://d77748f7bbdca14b96cc15884f175ac5@o4509243315585024.ingest.de.sentry.io/4509243317223504",
  sendDefaultPii: true
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
