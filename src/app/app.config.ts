import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideHttpClient } from '@angular/common/http'; //bunu ekstra ekledim angular 17 ye aşina değilim bir şeyler değişmiş buralarda :)
import { provideToastr } from 'ngx-toastr';  //burda toastr tanımladım angular 17 de farklı şeyler var adapte olmaya çalışırım

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),  provideHttpClient(), provideClientHydration(), provideAnimationsAsync(), provideToastr()]
};
