import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Input, SimpleChanges } from '@angular/core';
import { companies, Company, Product } from '../../../models/product.model';
import { ManagerService } from '../../../manager/manager.service'
import { ProductFormComponent } from '../../../manager/components/product-form/product-form.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { SystemService } from '../../system.service';

@Component({
  selector: 'product-list',
  standalone: false,

  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  @Input()
  category: string = '';
  products: Product[] = [];
  pagedProducts: Product[] = [];
  selectedProduct: Product | null = null;
  selectedProductIndex: number = -1;
  isLogin: boolean = false;
  isFavorite: boolean = false;
  rows: number = 28;
  first: number = 0;
  totalProducts: number = 0;
  companies = companies;

  constructor(private http: HttpClient, private _managerService: ManagerService, public dialog: MatDialog, private authService: AuthService, private route: ActivatedRoute, private _systemService: SystemService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.category = params['categoryName'] || '';
      this.loadProducts();
    });

    this.authService.refresh$.subscribe(
      (value: boolean) => {
        this.isLogin = value;
      },
      (err: any) => console.log('error: ', err)
    );
  }

  handleLoginChange(isLoggedIn: boolean): void {
    this.isLogin = isLoggedIn;
    console.log('Login status changed:', this.isLogin);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category'] && changes['category'].currentValue) {
      this.loadProducts();
    }
  }

  loadProducts() {
    this._managerService.getByCategory(this.category).subscribe(
      (data) => {
        this.products = data;
        this.totalProducts = data.length;
        this.updatePagedProducts(); // עדכון המוצרים בעמוד הנוכחי
      }, (error) => console.log('Failed to load products:', error)
    );
  }

  updatePagedProducts() {
    this.pagedProducts = this.products.slice(this.first, this.first + this.rows);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePagedProducts(); // עדכון המוצרים לעמוד הנוכחי
  }

  closeViewer(): void {
    this.selectedProduct = null;
    this.selectedProductIndex = -1;
    this.isFavorite = false;
  }

  closeOnOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeViewer();
    }
  }

  openViewer(product: Product): void {
    this.selectedProduct = product;
    this.selectedProductIndex = this.pagedProducts.indexOf(product);
    product.count_priority++;
  
    this._managerService.put(product, product.Id).subscribe(
      (data) => console.log('Product updated:', data),
      (error) => console.log('Failed to update product:', error)
    );
  }

  editRow(row: any, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ProductFormComponent, {
      disableClose: true,
      width: '40vw',
      maxWidth:'100vw',
      data: { product: row }
    });
    dialogRef.afterClosed().subscribe(_res => {
      this.loadProducts();
    });
  }

  openLinkInNewTab(_company:any): void {
    console.log("_company:", _company);
    if (typeof _company === 'string') {
      const selectedCompany = this.companies.find(company =>
        typeof company.name === 'string' && company.name === _company
      );
      const url = selectedCompany?.colors;
      window.open(url, '_blank');
    }

    else {
      const url = _company.colors;
      window.open(url, '_blank');
    }
  }

  async deleteProduct(product: Product, event: Event) {
    event.stopPropagation();
    const result = await this._managerService.deleteDialog(` את ${product.name} `);
    if (result.isConfirmed) {
      try {
        await this.deleteImage(product.image);
        this._managerService.delete(product.Id).subscribe(_response => {
          console.log('הנתונים נמחקו בהצלחה');
          this._managerService.showSuccess('!הנתונים נמחקו בהצלחה');
          this.loadProducts();
        }, error => {
          console.error('שגיאה במחיקת הנתונים 4', error);
          this._managerService.showError('5 !שגיאה במחיקת הנתונים');
        });
      } catch (error) {
        console.error("שגיאה במחיקת התמונה, לא ניתן להמשיך", error);
      }
    } else {
      console.log('המשתמש ביטל את המחיקה');
    }
  }
  deleteImage(imagePath: string) {
    this._managerService.deleteImage(imagePath).subscribe(response => {
      console.log('הנתונים נמחקו בהצלחה', response);
    }, error => {
      console.error('שגיאה במחיקת הנתונים 6', error);
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // מתבצע רק אם מוצג כרטיס מלא
    if (!this.selectedProduct) {
      return;
    }

    if (event.key === 'ArrowRight') {
      // לחיצה על חץ ימין - מעבר למוצר הקודם
      this.goToPreviousProduct();
      event.preventDefault();
    } else if (event.key === 'ArrowLeft') {
      // לחיצה על חץ שמאל - מעבר למוצר הבא
      this.goToNextProduct();
      event.preventDefault();
    }
  }

  goToPreviousProduct() {
    console.log(`goToPreviousProduct: selectedProductIndex:${this.selectedProductIndex}`);
    if (this.selectedProductIndex > 0) {
      this.selectedProductIndex--;
    }
    else {
      if (this.first > 0) {
        console.log(`if (this.first != 0): ${this.first}`)
        this.first -= this.rows;
        this.updatePagedProducts();
        this.selectedProductIndex = this.pagedProducts.length - 1;
      }
      else {
        console.log('else (this.first = 0):');
      }
    }
    this.selectedProduct = this.pagedProducts[this.selectedProductIndex];
  }

  goToNextProduct() {
    if (this.selectedProductIndex < this.pagedProducts.length - 1) {
      this.selectedProductIndex++;
    }
    else {
      if (this.first + this.rows < this.products.length - 1) {
        console.log(`if (this.first + this.rows < this.products.length): ${this.first + this.rows
          }`);
        //התמונה הראשונה בעמוד הבא
        this.first += this.rows;
        this.updatePagedProducts();
        this.selectedProductIndex = 0;
      }
      else {
        console.log('else (this.rows + 1 >= this.products.length):');
      }
    }
    this.selectedProduct = this.pagedProducts[this.selectedProductIndex];
  }

  isLike(product: Product) {
    return this._systemService.isExist(product)
  }

  addToCart(product: Product) {
    this.isFavorite = this._systemService.isExist(product);
    this._systemService.addProduct(product);
    console.log('המוצר נוסף לסל:', product);
  }
}