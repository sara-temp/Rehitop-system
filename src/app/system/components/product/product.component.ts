import { Component, EventEmitter, Input, Output } from '@angular/core';
import { companies, Product } from '../../../models/product.model';
import { SystemService } from '../../system.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormComponent } from '../../../manager/components/product-form/product-form.component';
import { ManagerService } from '../../../manager/manager.service'

@Component({
  selector: 'product-card',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input()
  productObject: Product | null = null;
  productObjectIndex: number = -1;
  isFavorite: boolean = false;
  @Input()
  isLogin: boolean = false;
  companies = companies;
  category: string = '';
  products: Product[] = [];
  pagedProducts: Product[] = [];
  totalProducts: number = 0;
  rows: number = 28;
  first: number = 0;

  constructor(private _systemService: SystemService, public dialog: MatDialog, private _managerService: ManagerService) { }

  closeOnOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeViewerComponent();
    }
  }

  closeViewerComponent() {
    if (this.productObject) {
      this.closeViewer.emit();
      this.productObject = null;
    }
  }
  

  @Output() closeViewer: EventEmitter<void> = new EventEmitter<void>();


  isLike(product: Product) {
    return this._systemService.isExist(product)
  }

  addToCart(product: Product) {
    this.isFavorite = this._systemService.isExist(product);
    this._systemService.addProduct(product);
    console.log('המוצר נוסף לסל:', product);
  }

  openLinkInNewTab(_company: any): void {
    console.log("_company:", _company);
    if (typeof _company === 'string') {
      const selectedCompany = this.companies.find(company =>
        typeof company.name === 'string' && company.name === _company
      );
      const url = selectedCompany?.colors;
      window.open(url, '_blank');
    }

    else {
      const url = _company?.colors;
      if (url) {
        window.open(url, '_blank');
      } else {
        console.warn("No URL available for this company.");
      }
    }
  }

  editRow(row: any, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ProductFormComponent, {
      disableClose: true,
      width: '35vw',
      maxWidth: '100vw',
      data: { product: row }
    });
  }

  updatePagedProducts() {
    this.pagedProducts = this.products.slice(this.first, this.first + this.rows);
  }

  @Output() deleteProductEvent: EventEmitter<{ product: Product, event: Event }> = new EventEmitter<{ product: Product, event: Event }>();

  onDelete(product: Product, event: Event) {
    // שידור האירוע עם הפרמטרים
    this.deleteProductEvent.emit({ product, event });
    this.productObject = null
  }
}
