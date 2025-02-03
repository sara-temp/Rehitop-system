import { Component } from '@angular/core';
import { SystemService } from '../../system.service';
import JSZip from 'jszip';


@Component({
  selector: 'app-favorite-cart',
  standalone:false,
  templateUrl: './favorite-cart.component.html',
  styleUrls: ['./favorite-cart.component.css']
})
export class FavoriteCartComponent {
  constructor(protected _systemService: SystemService) { }

 
  downloadImagesAsZip() {
    if (this._systemService.favoriteProducts.length === 0) {
      alert("אין מוצרים בסל");
      return;
    }

    const zip = new JSZip();

    this._systemService.favoriteProducts.forEach((product: any, index: number) => {
      // הורדת התמונה מתוך URL
      fetch(product.image)
        .then(response => response.blob())
        .then(blob => {
          zip.file(`image_${index + 1}.jpg`, blob);

          // כשכל התמונות נוספו ל-ZIP, נוכל להוריד אותו
          if (index === this._systemService.favoriteProducts.length - 1) {
            zip.generateAsync({ type: 'blob' })
              .then(function(content) {
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
    this._systemService.favoriteProducts = this._systemService.favoriteProducts.filter(product => product.Id !== productId);
  }

  clearCart() {
    this._systemService.favoriteProducts = [];
  }
}
