import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    ProductListComponent
  ],
  exports: [
    ProductListComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class SystemModule { }
