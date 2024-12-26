import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SystemModule } from "./system/system.module";
import { HeaderComponent } from './system/components/header/header.component';
import { ManagerModule } from './manager/manager.module';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';


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
    provideClientHydration(withEventReplay()), provideHttpClient(withFetch()), importProvidersFrom(HttpClientModule), provideAnimationsAsync(),
    providePrimeNG({
      theme: {
          preset: Aura
      }
  })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
