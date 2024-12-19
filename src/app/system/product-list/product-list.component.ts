import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { product } from '../../models/product.model';

@Component({
  selector: 'product-list',
  standalone: false,
  
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  @Input() 
  category: string = 'ספות';
  products: product[] = [];

  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<product[]>('assets/products.json').subscribe(
      (data) => {
        this.products = data.filter(product => product.category === this.category);
      },
      (error) => {
        console.log('Failed to load products:', error);
        
      }
    )
  }
}
