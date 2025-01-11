import { HttpClient } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ManagerService } from '../../../manager/manager.service'
import { ProductFormComponent } from '../../../manager/components/product-form/product-form.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../service/auth.service';

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
  selectedProduct: Product | null = null;
  isLogin: boolean = false;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  pagedProducts: Product[] = [];
  totalProducts: number = 0;

  constructor(private http: HttpClient, private _managerService: ManagerService, public dialog: MatDialog, private authService: AuthService) { }

  ngOnInit() {
    this.loadProducts();
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
        this.updatePagedProducts();
      }, (error) => console.log('Failed to load products:', error)
    );
  }

  updatePagedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedProducts = this.products.slice(startIndex, endIndex);
  }
  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages()) {
      this.currentPage = page;
      this.updatePagedProducts();
    }
  }
  totalPages() {
    return Math.ceil(this.totalProducts / this.itemsPerPage);
  }
  pagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }
  
  closeViewer(): void {
    this.selectedProduct = null;
  }

  openViewer(product: Product): void {
    console.log('in open viewer', product)
    this.selectedProduct = product;
  }

  editRow(row: any, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ProductFormComponent, {
      data: { product: row }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.loadProducts();
    });
  }

  async deleteProduct(product: Product, event: Event) {
    event.stopPropagation();
    const result = await this._managerService.deleteDialog();
    if (result.isConfirmed) {
      try {
        await this.deleteImage(product.image);
        this._managerService.delete(product.Id).subscribe(response => {
          console.log('הנתונים נמחקו בהצלחה');
          this._managerService.showSuccess('!הנתונים נמחקו בהצלחה');
          this.loadProducts();
        }, error => {
          console.error('שגיאה במחיקת הנתונים', error);
          this._managerService.showError('!שגיאה במחיקת הנתונים');
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
      console.error('שגיאה במחיקת הנתונים', error);
    });
  }
}