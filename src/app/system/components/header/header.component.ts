import { Component, EventEmitter, Output } from '@angular/core';
import { Category } from '../../../models/product.model';

@Component({
  selector: 'header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  categories: string[];
  categorySelected: string = '';

  constructor() {
    this.categories = Object.values(Category);
  }
  
  onCategoryClick(category: string) {
    this.categorySelected = category;
  }
}
