import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Product, SubCategory, ChildrensRoom, Closets, DiningAreas, Mattresses, Office, Salon, Categories, companies } from '../../../models/product.model';
import { ManagerService } from '../../manager.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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

  products!: Product[];

  product!: Product;

  selectedProducts!: Product[] | null;

  @ViewChild('dt') dt!: Table;

  cols!: Column[];

  categoryEnum!: TreeNode[];

  deleteInProgress = false;

  result: any;

  companies = companies;

  constructor(
    private _managerService: ManagerService,
    private messageService: MessageService,
    private dialog: MatDialog,
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

  matchColor(_company: any) {
    if (typeof _company === 'string') {
      const selectedCompany = this.companies.find(company =>
        typeof company.name === 'string' && company.name === _company
      );
      return selectedCompany?.colors;
    }
    return _company.colors;
  }

  openLinkInNewTab(_company: any): string {
    console.log(_company);
    let url = "";
    if (typeof _company === 'string') {
      const selectedCompany = this.companies.find(company =>
        typeof company.name === 'string' && company.name === _company
      );
      url = selectedCompany?.colors || '';
      window.open(url, '_blank');
    }

    else {
      url = _company.colors;
    }
    if (url) window.open(url, '_blank');
    return url;
  }

  editRow(row: any) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
    disableClose: true,
      width: '40vw',
      maxWidth:'100vw',
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
}