import { HttpClient } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ManagerService } from '../../../manager/manager.service'
import { ProductFormComponent } from '../../../manager/components/product-form/product-form.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../service/auth.service';
import { ActivatedRoute } from '@angular/router';

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
  isLogin: boolean = false;

  rows: number = 28;
  first: number = 0;
  totalProducts: number = 0;

  constructor(private http: HttpClient, private _managerService: ManagerService, public dialog: MatDialog, private authService: AuthService, private route: ActivatedRoute) { }

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
  }

  closeOnOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeViewer();
    }
  }

  openViewer(product: Product): void {
    console.log('in open viewer', product)
    this.selectedProduct = product;
    product.countPriority++;
    this._managerService.put(product, product.Id).subscribe(
      (data) => console.log('Product updated:', data),
      (error) => console.log('Failed to update product:', error)
      );
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

  openLinkInNewTab(url: string): void {
    window.open(url, '_blank');
  }

  async deleteProduct(product: Product, event: Event) {
    event.stopPropagation();
    const result = await this._managerService.deleteDialog(` את ${product.name} `);
    if (result.isConfirmed) {
      try {
        await this.deleteImage(product.image);
        this._managerService.delete(product.Id).subscribe(response => {
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
}