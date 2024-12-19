import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SystemModule } from './system/system.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SystemModule
  ],
  providers: [
    provideClientHydration(withEventReplay()), importProvidersFrom(HttpClientModule)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
