import { ApplicationConfig, Provider, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
export const APP_PROVIDERS: Provider[] = [
  DatePipe
];
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimationsAsync(),importProvidersFrom(HttpClientModule)]
};
