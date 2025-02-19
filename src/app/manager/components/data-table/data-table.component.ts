import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Product, SubCategory, ChildrensRoom, Closets, DiningAreas, Mattresses, Office, Salon, Categories, companies, SCHEMA_RUNTIME, Company } from '../../../models/product.model';
import { ManagerService } from '../../manager.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TreeSelectModule } from 'primeng/treeselect';
import { catchError, forkJoin, of } from 'rxjs';
import { TreeNode } from 'primeng/api';
import { FilterService } from 'primeng/api';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

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

  cols!: Column[];

  categoryOptions!: TreeNode[];

  deleteInProgress = false;

  result: any;

  companies = companies;

  // search
  searchValue: string | undefined;

  @ViewChild('dt', { static: false }) dt!: Table;

  selectedCategory: any = null; // משתנה חדש לשמירת הבחירה

  ngAfterViewInit() {
    console.log(this.dt);
  }
  constructor(
    private _managerService: ManagerService,
    private dialog: MatDialog,
    private filterService: FilterService,
    // private primengConfig: PRIME_NG_CONFIG
  ) { }

  ngOnInit(): void {
    this._managerService.getAll().subscribe((products) => {
      this.products = products.map(product =>
      ({...product,
        date:new Date(product.date?product.date:'')})
        
      );
    });

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'image', header: 'Image' },
      { field: 'price', header: 'Price' },
      { field: 'categories', header: 'Categories' },
      { field: 'describe', header: 'Describe' },
      { field: 'size', header: 'Sizes' },
      { field: 'company', header: 'Company' },
      { field: 'date', header: 'Date' },
      { field: 'catalog_img', header: 'Catalog_img' },
      { field: 'colors', header: 'Colors' },
    ];

    this.categoryOptions = this.generateCategoryOptions()
    console.log('categoryOptions', this.categoryOptions);
    this.registerCustomCategoryFilter();
  }
  

  onSearch(event: any) {
    if (this.dt) {
      this.dt.filterGlobal(event.target.value, 'contains');
    }
  }

  onCategoryRemove(currentProduct: Product, category: any, event: Event): void {
    event.stopPropagation(); // מונע את פתיחת ה-`p-treeselect`
    // לוגיקה להסרת הקטגוריה
    console.log('Removing category:', category);
    const updatedCategories = currentProduct.categories.filter((c: string) => c !== category);
    currentProduct.categories = updatedCategories;
  }

  async deleteSelectedProducts() {
    this.result = await this._managerService.deleteDialog(`${this.selectedProducts?.length} מוצרים  `)
    for (const prod of this.selectedProducts || []) {
      await this.deleteProduct(prod);
    }
  }

  onCompanyChange(currentProduct: Product, event: any): void {
    const selectedCompanyName = event.target.value;
    const selectedCompany = this.companies.find(company => company.name === selectedCompanyName);
    if (selectedCompany) {
      currentProduct.company = selectedCompany;
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
      width: '35vw',
      maxWidth: '100vw',
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
  // search

  generateCategoryOptions(): TreeNode[] {
    const schemaData = SCHEMA_RUNTIME;
  
    const buildSubItems = (subCategories: Record<string, any>, parent?: TreeNode): TreeNode[] | undefined => {
      if (!subCategories || typeof subCategories !== 'object') return undefined;
  
      return Object.entries(subCategories).map(([subCategory, nestedSubCategories]) => {
        const node: TreeNode = {
          label: typeof nestedSubCategories === 'string' ? nestedSubCategories : subCategory,
          parent
        };
        node.children = typeof nestedSubCategories === 'object' ? buildSubItems(nestedSubCategories, node) : undefined;
        return node;
      });
    };
  
    const categoryOptions: TreeNode[] = Object.entries(schemaData).map(([mainCategory, subCategories]) => {
      const node: TreeNode = {
        label: mainCategory,
        children: buildSubItems(subCategories as Record<string, any>)
      };
      return node;
    });
  
    return categoryOptions;
  }

  onFilter(event: any) {
    setTimeout(() => {
      this.dt?.filterGlobal(event.target.value, 'contains');
    });
  }

  filter(event: any) {
    this.dt.filter(this.selectedCategory, 'categories', 'in');
  }

  private registerCustomCategoryFilter(): void {
    this.filterService.register('customCategory', (value: any, filter: any): boolean => {
      // אם לא הוגדר פילטר – מציגים את השורה
      if (!filter || (Array.isArray(filter) && filter.length === 0)) {
        return true;
      }
      // אם הערך בשורה אינו מערך – לא ניתן לסנן
      if (!value || !Array.isArray(value)) {
        return false;
      }
      // נניח ש-"filter" הוא מערך של מיתרים (הקטגוריות שנבחרו)
      // בודקים אם לפחות קטגוריה אחת מתוך השורה (value) כוללת אחת מהקטגוריות שבפילטר (case-insensitive)
      return filter.some((f: string) =>
        value.some((cat: string) => cat.toLowerCase().includes(f.toLowerCase()))
      );
    });
  }
  
  clear(table: Table) {
    table.clear();
    this.searchValue = ''
  }

  compareCompanies(company1: Company, company2: Company): boolean {
    return company1 && company2 ? company1.name === company2.name : company1 === company2;
  }
}