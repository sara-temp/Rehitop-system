import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataTableComponent } from './manager/components/data-table/data-table.component'
import { LoginComponent} from './manager/components/login/login.component'
import { authGuard } from './service/auth.guard';
import { HeaderComponent } from './system/components/header/header.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'edit', component: DataTableComponent },
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
