import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

const modules = [MatGridListModule, MatCardModule]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...modules
  ],
  exports: modules
})
export class MaterialModule { }
