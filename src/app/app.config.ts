import { ApplicationConfig, provideZoneChangeDetection, ErrorHandler, APP_INITIALIZER  } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Router } from '@angular/router';
import * as Sentry from "@sentry/angular";

export const appConfig: ApplicationConfig = {
  providers: [ 
  {
    provide: ErrorHandler,
    useValue: Sentry.createErrorHandler(),
  },
  {
    provide: Sentry.TraceService,
    deps: [Router],
  },
  {
    provide: APP_INITIALIZER,
    useFactory: () => () => {},
    deps: [Sentry.TraceService],
    multi: true,
  },provideZoneChangeDetection({ eventCoalescing: true }), provideHttpClient(withFetch()), provideRouter(routes), provideClientHydration(), provideAnimationsAsync()]
};
