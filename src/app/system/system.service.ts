import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private favoriteProductsSubject = new BehaviorSubject<Product[]>(this.loadFavorites());
  favoriteProducts$ = this.favoriteProductsSubject.asObservable();

  productList: Product[] = [];

  // במקום להשתמש במערך ישירות, אנחנו עובדים עם ה-BehaviorSubject
  private loadFavorites(): Product[] {
    const saved = localStorage.getItem('favoriteProducts');
    return saved ? JSON.parse(saved) : [];
  }

  private saveFavorites(favorites: Product[]) {
    localStorage.setItem('favoriteProducts', JSON.stringify(favorites));
  }

  addProduct(product: Product) {
    let favorites = this.favoriteProductsSubject.getValue();
    const exists = favorites.some(p => p.Id === product.Id);
    if (!exists) {
      favorites = [...favorites, product];
    } else {
      favorites = favorites.filter(p => p.Id !== product.Id);
    }
    this.saveFavorites(favorites);
    this.favoriteProductsSubject.next(favorites);
  }

  removeProduct(productId: string) {
    const favorites = this.favoriteProductsSubject.getValue().filter(p => p.Id !== productId);
    this.saveFavorites(favorites);
    this.favoriteProductsSubject.next(favorites);
  }

  clearFavorites() {
    this.saveFavorites([]);
    this.favoriteProductsSubject.next([]);
  }

  isExist(product: Product): boolean {
    const favorites = this.favoriteProductsSubject.getValue();
    return favorites.some(p => p.Id === product.Id);
  }
}
