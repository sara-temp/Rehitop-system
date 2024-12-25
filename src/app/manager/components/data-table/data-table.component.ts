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

    this.cols = [
      { field: 'Id', header: 'Id', customExportHeader: 'Product Id' },
      { field: 'name', header: 'Name' },
      { field: 'image', header: 'Image' },
      { field: 'price', header: 'Price' },
      { field: 'categories', header: 'Categories' },
      { field: 'describe', header: 'Describe' },
      { field: 'colors', header: 'Colors' },
      { field: 'company', header: 'Company' }

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
      message: 'האם את/ה בטוח/ה שהנך רוצה למחוק את הפריטים הנבחרים?',
      header: 'אישור',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let prods = this.products.filter((val) => this.selectedProducts?.includes(val));
        let failed = []
        prods.forEach(prod =>
          this.managerService.delete(prod.Id).
            subscribe({
              next: () => { },
              error: (err) => { failed.push(prod) },
              complete: () => { setTimeout(() => { window.location.reload() }, 3000); }
            })
        );
        if (failed.length === 0) {
          this.selectedProducts = null;
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000
          });
        }
        else { 
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete product',
            life: 3000
          });
        }
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'האם את/ה בטוח/ה שהנך רוצה למחוק ' + product.name + '?',
      header: 'אישור',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (product) {
          console.log('1', product)
          let result = this.managerService.delete(product.Id);
          console.log('3', result, '(data-table-component)')
          result.subscribe({
            next: () => {
              console.log('4 Product Deleted success (data-table-component)')
              window.location.reload();
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Product Deleted',
                life: 3000
              });
            },
            error: (err) => {
              console.log('4 Failed Product Deleted (data-table-component)')
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete product',
                life: 3000
              });
            },
            complete: () => { setTimeout(() => { window.location.reload() }, 3000); }
          });
        }
        this.product = new Product('', '', '', [Category.Empty], 0);
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