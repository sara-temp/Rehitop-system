import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HomePageComponent } from './components/home-page/home-page.component';


const routes: Routes = [
  { path: 'category/:categoryName', component: ProductListComponent },
  { path: '', component: HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {}