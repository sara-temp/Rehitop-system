import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './components/product/product.component';
import { Product } from '../models/product.model'
import { ProductListComponent } from './components/product-list/product-list.component';
import { MaterialModule } from '../material/material.module';
import { HeaderComponent } from './components/header/header.component';
import { ManagerService } from '../manager/manager.service'

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
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from '../manager/components/login/login.component';
import { ManagerModule } from '../manager/manager.module';
import { Menubar } from 'primeng/menubar';
import { SystemRoutingModule } from './system-routing.module';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductComponent,
    HeaderComponent,
    HomePageComponent,
    FooterComponent
  ],
  imports: [
    CommonModule, PaginatorModule, RouterModule, ManagerModule, MaterialModule, Menubar, ButtonModule, CheckboxModule, CommonModule, MaterialModule, MultiSelectModule, TableModule, Dialog, Ripple, SelectModule, ToastModule, ToolbarModule, ConfirmDialog, InputTextModule, TextareaModule, CommonModule, FileUpload, DropdownModule, Tag, RadioButton, Rating, InputTextModule, FormsModule, InputNumber, IconFieldModule, InputIconModule, SystemRoutingModule],
  providers: [ManagerService],
  exports: [
    ProductListComponent,
    ProductComponent,
    HeaderComponent,
    FooterComponent
  ]
})
export class SystemModule { }