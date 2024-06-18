import { ApplicationConfig, Provider, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DropzoneDirective } from './dropzone.directive'; // Import your Dropzone directive
import * as Dropzone from 'dropzone';
export const APP_PROVIDERS: Provider[] = [
  DatePipe,
];
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), DropzoneDirective,provideAnimationsAsync(),importProvidersFrom(HttpClientModule,NgxDaterangepickerMd.forRoot())]
};
