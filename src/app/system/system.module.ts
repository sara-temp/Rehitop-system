import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './components/product/product.component';
import { Product } from '../models/product.model'
import { ProductListComponent } from './components/product-list/product-list.component';
import { MaterialModule } from '../material/material.module';
import { HeaderComponent } from './components/header/header.component';



@NgModule({
  declarations: [
    ProductListComponent,
    ProductComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    ProductListComponent,
    ProductComponent,
    HeaderComponent
  ]
})
export class SystemModule { }
