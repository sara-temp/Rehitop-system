import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SystemModule } from "./system/system.module";
import { HeaderComponent } from './system/components/header/header.component';
import { ManagerModule } from './manager/manager.module';
import { provideHttpClient, withFetch } from '@angular/common/http'; 

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
    provideClientHydration(withEventReplay()), importProvidersFrom(HttpClientModule), provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
