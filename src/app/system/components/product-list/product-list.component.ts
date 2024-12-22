import { HttpClient } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ManagerService} from '../../../manager/manager.service'
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

  constructor(private http: HttpClient, private _ManagerService:ManagerService) {}
  
  ngOnInit() {
    this.loadProducts();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category'] && changes['category'].currentValue) {
      this.loadProducts();
    }
  }
  
  loadProducts() {
    this._ManagerService.getByCategory(this.category).subscribe(
      (data) => this.products = data,
      (error) => console.log('Failed to load products:', error)
    );

  }
  
  

  closeViewer(): void {
    this.selectedProduct = null;
  }

  openViewer(product: Product): void {
    console.log('in open viewer', product)
    this.selectedProduct = product;
  }
}