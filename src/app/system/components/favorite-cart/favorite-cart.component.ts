// favorite-cart.component.ts
import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../system.service';
import { Product } from '../../../models/product.model';
import JSZip from 'jszip';
import { ManagerService } from '../../../manager/manager.service';

@Component({
  selector: 'app-favorite-cart',
  standalone:false,
  templateUrl: './favorite-cart.component.html',
  styleUrls: ['./favorite-cart.component.css']
})
export class FavoriteCartComponent implements OnInit {
  favoriteProducts: Product[] = [];

  selectedProduct: Product | null = null;
  selectedProductIndex: number = -1;

  constructor(private _managerService: ManagerService, private systemService: SystemService) { }

  ngOnInit() {
    // נרשמים לעדכונים של המועדפים
    this.systemService.favoriteProducts$.subscribe(products => {
      this.favoriteProducts = products;
    });
  }

  downloadImagesAsZip() {
    if (this.favoriteProducts.length === 0) {
      alert("אין מוצרים בסל");
      return;
    }
    const zip = new JSZip();
    this.favoriteProducts.forEach((product: Product, index: number) => {
      fetch(product.image)
        .then(response => response.blob())
        .then(blob => {
          zip.file(`image_${index + 1}.jpg`, blob);
          if (index === this.favoriteProducts.length - 1) {
            zip.generateAsync({ type: 'blob' })
              .then(content => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'favorite_images.zip';
                link.click();
              });
          }
        });
    });
  }

  removeProduct(productId: string) {
    this.systemService.removeProduct(productId);
  }

  clearCart() {
    this.systemService.clearFavorites();
  } 

  
  closeViewer(): void {
    this.selectedProduct = null;
    this.selectedProductIndex = -1;
  }

  closeOnOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeViewer();
    }
  }

  openViewer(product: Product): void {
    this.selectedProduct = product;
    this.selectedProductIndex = this.favoriteProducts.indexOf(product);
    
    product.count_priority++;

    this._managerService.put(product, product.Id).subscribe(
      (data) => console.log('Product updated:', data),
      (error) => console.log('Failed to update product:', error)
    );
  }
}
