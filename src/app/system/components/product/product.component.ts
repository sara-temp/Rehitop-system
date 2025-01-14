import { Component, Input } from '@angular/core';
import { Product } from '../../../models/product.model';

  @Component({
    selector: 'product-card',
    standalone: false,
    templateUrl: './product.component.html',
    styleUrl: './product.component.css'
  })
  export class ProductComponent {
    @Input()
    productObject: Product | null = null;

    openLinkInNewTab(url: string): void {
      window.open(url, '_blank');
    }
    closeImage(): void {
      this.productObject = null;
    }
  }
