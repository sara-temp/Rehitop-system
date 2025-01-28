import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Product, SubCategory, ChildrensRoom, Closets, DiningAreas, Mattresses, Office, Salon, Categories } from '../../../models/product.model';
import { ManagerService } from '../../manager.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TreeSelectModule } from 'primeng/treeselect';
import { catchError, forkJoin, of } from 'rxjs';


interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface TreeNode {
  label: string;
  value: SubCategory;
  children?: TreeNode[];
};

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

  categoryEnum!: TreeNode[];

  selectedCategories!: SubCategory[];

  deleteInProgress = false;

  result: any;

  constructor(
    private _managerService: ManagerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialog: MatDialog,
    private route: Router
    // private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this._managerService.getAll().subscribe((products) => {
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

    this.categoryEnum = [
      {
        label: Categories.SALON,
        value: Categories.SALON,
        children: Object.values(Salon).map((salon) => ({
          label: salon,
          value: salon,
        })),
      },
      {
        label: Categories.MATTRESSES,
        value: Categories.MATTRESSES,
        children: Object.values(Mattresses).map((mattress) => ({
          label: mattress,
          value: mattress,
        })),
      },
      {
        label: Categories.CHILDRENSROOMS,
        value: Categories.CHILDRENSROOMS,
        children: Object.values(ChildrensRoom).map((room) => ({
          label: room,
          value: room,
        })),
      },
      {
        label: Categories.CLOSETS,
        value: Categories.CLOSETS,
        children: Object.values(Closets).map((closet) => ({
          label: closet,
          value: closet,
        })),
      },
      {
        label: Categories.DININGAREAS,
        value: Categories.DININGAREAS,
        children: Object.values(DiningAreas).map((dining) => ({
          label: dining,
          value: dining,
        })),
      },
      {
        label: Categories.OFFICE,
        value: Categories.OFFICE,
        children: Object.values(Office).map((office) => ({
          label: office,
          value: office,
        })),
      },
    ];
  }

  onSearch(event: any) {
    if (this.dt) {
      this.dt.filterGlobal(event.target.value, 'contains');
    }
  }

  async deleteSelectedProducts() {
    this.result = await this._managerService.deleteDialog(`${this.selectedProducts?.length} מוצרים  `)
    for (const prod of this.selectedProducts || []) {
      await this.deleteProduct(prod);
    }
  }

  async deleteProduct(product: Product) {
    if (!this.result)
      this.result = await this._managerService.deleteDialog(` - ${product.name}`);
    if (this.result.isConfirmed) {
      try {
        await this.deleteImage(product.image);
        this._managerService.delete(product.Id).subscribe(response => {
          console.log('הנתונים נמחקו בהצלחה');
          this._managerService.showSuccess('!הנתונים נמחקו בהצלחה');
          this._managerService.getAll().subscribe(data => {
            this.products = data;
          }, error => {
            console.error("שגיאה בעדכון הנתונים", error);
          });
        }, error => {
          console.error('שגיאה במחיקת הנתונים', error);
          this._managerService.showError('!שגיאה במחיקת הנתונים');
        });
      } catch (error) {
        console.error("שגיאה במחיקת התמונה, לא ניתן להמשיך", error);
      }
    }
  }
  deleteImage(imagePath: string) {
    this._managerService.deleteImage(imagePath).subscribe(response => {
      console.log('הנתונים נמחקו בהצלחה', response);
    }, error => {
      console.error('שגיאה במחיקת הנתונים', error);
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


  editRow(row: any) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      data: { product: row }
    });
    dialogRef.afterClosed().subscribe(res => {
      this._managerService.getAll().subscribe(data => {
        this.products = data;
      }, error => {
        console.error("שגיאה בעדכון הנתונים", error);
      });
      this._managerService.getAll().subscribe(data => {
        this.products = data;
      }, error => {
        console.error("שגיאה בעדכון הנתונים", error);
      });
    });
  }

  backToProd() {
    this.route.navigate(['']);
  }
}