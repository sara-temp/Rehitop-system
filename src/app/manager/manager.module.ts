import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './components/data-table/data-table.component';
import { MaterialModule } from '../material/material.module';
<<<<<<< HEAD
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DataTableComponent,
    ProductFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    DataTableComponent,
    ProductFormComponent
  ]
=======
import { FormsModule } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUpload } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { RadioButton } from 'primeng/radiobutton';
import { Rating } from 'primeng/rating';
import { InputNumber } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [DataTableComponent],
  imports: [ButtonModule, CheckboxModule, CommonModule, MaterialModule, TableModule, Dialog, Ripple, SelectModule, ToastModule, ToolbarModule, ConfirmDialog, InputTextModule, TextareaModule, CommonModule, FileUpload, DropdownModule, Tag, RadioButton, Rating, InputTextModule, FormsModule, InputNumber, IconFieldModule, InputIconModule],
  providers: [MessageService, ConfirmationService],
  exports: [DataTableComponent]
>>>>>>> 0c1d24cf6a6eb4205aad018ed22ecbdb7109a7e0
})
export class ManagerModule { }
