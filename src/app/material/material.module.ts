import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectSearchModule } from 'mat-select-search';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox'
import { MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';

const modules = [MatGridListModule,MatCheckboxModule,MatButtonToggleModule,ReactiveFormsModule, MatCardModule, MatToolbarModule, MatTabsModule, MatPaginatorModule, MatSortModule, MatTableModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule, MatExpansionModule, MatSelectSearchModule, MatAutocompleteModule, MatChipsModule, BrowserAnimationsModule]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...modules
  ],
  exports: modules
})
export class MaterialModule { }
