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
    imageObject: Product | null = null;

    closeImage(): void {
      this.imageObject = null;
    }
  }
