import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './components/product/product.component';
import { Product } from '../models/product.model'
import { ProductListComponent } from './components/product-list/product-list.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    ProductListComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    ProductListComponent,
    ProductComponent]
})
export class SystemModule { }
