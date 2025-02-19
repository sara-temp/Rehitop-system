import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './components/data-table/data-table.component';
import { MaterialModule } from '../material/material.module';
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
import { TreeSelectModule } from 'primeng/treeselect';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { RouterModule } from '@angular/router';
import { ChipModule } from 'primeng/chip';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SharedModule } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // ייבוא מודול האנימציות


@NgModule({
  declarations: [DataTableComponent, ProductFormComponent, LoginComponent],
  imports: [BrowserAnimationsModule, CalendarModule, SharedModule, ScrollTopModule, ScrollingModule, ChipModule,RouterModule ,ButtonModule, CheckboxModule, CommonModule, ReactiveFormsModule,TreeSelectModule, MaterialModule, MultiSelectModule, TableModule, Dialog, Ripple, SelectModule, ToastModule, ToolbarModule, ConfirmDialog, InputTextModule, TextareaModule, CommonModule, FileUpload, DropdownModule, Tag, RadioButton, Rating, FormsModule, InputNumber, IconFieldModule, InputIconModule],
  providers: [MessageService, ConfirmationService],
  exports: [DataTableComponent, ProductFormComponent, LoginComponent]
})
export class ManagerModule { }
