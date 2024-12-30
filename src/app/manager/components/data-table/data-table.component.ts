import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Product, Category } from '../../../models/product.model';
import { ManagerService } from '../../manager.service';
import { Router } from '@angular/router';


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
  styleUrl: './data-table.component.css'
})
export class DataTableComponent implements OnInit {


  getSeverity(arg0: any): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined {
    throw new Error('Method not implemented.');
  }
  productDialog: boolean = false;

  products!: Product[];

  product!: Product;

  selectedProducts!: Product[] | null;

  submitted: boolean = false;

  @ViewChild('dt') dt!: Table;

  cols!: Column[];

  exportColumns!: ExportColumn[];

  categoryEnum!: Category[];

  selectedCategories!: Category[];

  error = {
    severity: 'error',
    summary: 'Error',
    detail: 'Failed to delete product',
    life: 3000
  };
  success = {
    severity: 'success',
    summary: 'Successful',
    detail: 'Products Deleted',
    life: 3000
  };

  constructor(
    private managerService: ManagerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: Router
    // private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.managerService.getAll().subscribe((products) => {
      this.products = products;
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

    this.categoryEnum = Object.values(Category);
    console.log(this.categoryEnum)
  }

  onSearch(event: any) {
    if (this.dt) {
      this.dt.filterGlobal(event.target.value, 'contains');
    }
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
              error: (err) => {
                failed.push(prod)
                console.log(`err in data table ${err}`)
              },
              complete: () => {
                console.log('5 data table')
                if (failed.length === 0) {
                  this.selectedProducts = null;
                  this.messageService.add(this.success);
                }
                else {
                  this.messageService.add(this.error);
                }
                window.location.reload()
              }
            })
        );
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
              this.messageService.add(this.success);
            },
            error: (err) => {
              console.log('4 Failed Product Deleted (data-table-component)', err)
              this.messageService.add(this.error);
            },
            complete: () => {
              console.log('5 data table')
              window.location.reload();
            }
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
}