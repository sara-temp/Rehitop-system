import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  favoriteProducts: Product[] = [];

  constructor() { 
    this.loadFavorites();
  }

  addProduct(product: Product) {
    const exists = this.favoriteProducts.some(p => p.Id === product.Id);
    if (!exists) {
      this.favoriteProducts.push(product);
    } else {
      this.favoriteProducts = this.favoriteProducts.filter(p => p.Id !== product.Id);
    }
    this.saveFavorites(); // עדכון ה-localStorage
  }

  isExist(product: Product): boolean {
    return this.favoriteProducts.some(p => p.Id === product.Id);
  }

  private saveFavorites() {
    localStorage.setItem('favoriteProducts', JSON.stringify(this.favoriteProducts));
  }

  private loadFavorites() {
    const savedProducts = localStorage.getItem('favoriteProducts');
    if (savedProducts) {
      this.favoriteProducts = JSON.parse(savedProducts);
    }
  }
}
