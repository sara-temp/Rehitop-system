import { Component, Input } from '@angular/core';
import { companies, Product } from '../../../models/product.model';

@Component({
  selector: 'product-card',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  [x: string]: any;
  @Input()
  productObject: Product | null = null;
  companies = companies;

  openLinkInNewTab(_company: any): void {
    console.log(_company);
    if (typeof _company === 'string') {
      const selectedCompany = this.companies.find(company =>
        typeof company.name === 'string' && company.name === _company
      );
      const url = selectedCompany?.colors;
      window.open(url, '_blank');
    }

    else {
      const url = _company.colors;
      window.open(url, '_blank');
    }
  }

  closeImage(): void {
    this.productObject = null;
  }
}
