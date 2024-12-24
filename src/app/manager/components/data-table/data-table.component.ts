import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Product, Category } from '../../../models/product.model';
import { ManagerService } from '../../manager.service';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'data-table',
  standalone: false,

  templateUrl: './data-table.component.html',
  // styleUrl: './data-table.component.css'
  styles: [
    `:host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }`
  ]
})
export class DataTableComponent implements OnInit {
  productDialog: boolean = false;

  products!: Product[];

  product!: Product;

  selectedProducts!: Product[] | null;

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  cols!: Column[];

  exportColumns!: ExportColumn[];

  categoryEnum = Object.values(Category);

  constructor(
    private managerService: ManagerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    // private cd: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.managerService.getAll().subscribe((products) => {
      this.products = products;
    });
  }

  exportCSV() {
    this.dt.exportCSV();
  }

  onSearch(event: any) {
    if (this.dt) {
      this.dt.filterGlobal(event.target.value, 'contains');
    }
  }

  loadDemoData() {
    this.managerService.getAll().subscribe((data) => {
      this.products = data;
      // this.cd.markForCheck();
    });

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];

    this.cols = [
      { field: 'Id', header: 'Id', customExportHeader: 'Product Id' },
      { field: 'name', header: 'שם' },
      { field: 'image', header: 'תמונה' },
      { field: 'price', header: 'מחיר' },
      { field: 'categories', header: 'קטגוריה' },
      { field: 'describe', header: 'תיאור' },
      { field: 'colors', header: 'צבעים' },
      {field: 'company', header: 'חברה'}

    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  openNew() {
    this.product = new Product("", "", "", [Category.Empty], 0);
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
        this.selectedProducts = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter((val) => val.Id !== product.Id);
        this.product = new Product('', '', '', [Category.Empty], 0);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000
        });
      }
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].Id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  // getSeverity(status: string) {
  //   switch (status) {
  //     case 'INSTOCK':
  //       return 'success';
  //     case 'LOWSTOCK':
  //       return 'warning';
  //     case 'OUTOFSTOCK':
  //       return 'danger';
  //   }
  // }

  saveProduct() {
    this.submitted = true;

    if (this.product.name?.trim()) {
      if (this.product.Id) {
        this.products[this.findIndexById(this.product.Id)] = this.product;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000
        });
      } else {
        this.product.Id = this.createId();
        this.product.image = 'product-placeholder.svg';
        this.products.push(this.product);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000
        });
      }

      this.products = [...this.products];
      this.productDialog = false;
      this.product = new Product('', '', '', [Category.Empty], 0);
    }
  }
}