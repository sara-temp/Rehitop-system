import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule, withEventReplay } from '@angular/platform-browser';

import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SystemModule } from "./system/system.module";
import { ManagerModule } from './manager/manager.module';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MyPreset } from '../mytheme';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SystemModule,
    ManagerModule
  ],
  providers: [
    provideHttpClient(withFetch()), importProvidersFrom(HttpClientModule), provideAnimationsAsync(),
    providePrimeNG(
      {theme: {
          preset: MyPreset,
        }}
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
