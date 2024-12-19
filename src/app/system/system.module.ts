import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './components/product/product.component';
import { Product } from '../models/product.model'


@NgModule({
  declarations: [ProductComponent,],
  imports: [
    CommonModule
  ],
  exports:[ProductComponent]
})
export class SystemModule { }
