import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, model, signal, ViewChild } from '@angular/core';
import { Category, Product } from '../../../models/product.model';
//לבדוק למה לא מקבל ממודול המטריאל
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ManagerService } from '../../manager.service'

@Component({
  selector: 'data-table',
  standalone: false,

  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent {
  displayedColumns: string[] = ['edit', 'id', 'image', 'name', 'category', 'price', 'describe', 'colors', 'company'];
  dataSource = new MatTableDataSource<Product>([]);
  categories = Object.values(Category);
  selectedCategories: Set<Category> = new Set<Category>();
  pageSize = 5;
  pageSizeOptions = [5, 10, 20, 50];
  currentPage = 0;

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private _managerService: ManagerService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData = (): void => {
    this._managerService.getAll().subscribe(
      (data: Product[]) => {
        this.dataSource.data = data;
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }



  get filteredProducts() {
    return this.dataSource.data.filter(product =>
      this.selectedCategories.size === 0 ||
      Array.from(this.selectedCategories).every((category) => product.categories.includes(category))
    );
  }

  toggleCategory(category: Category) {
    if (this.selectedCategories.has(category)) {
      this.selectedCategories.delete(category);
    } else {
      this.selectedCategories.add(category);
    }
  }

  getPaginatedProducts(): Product[] {
    const startIndex = this.currentPage * this.pageSize;
    return this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getPaginatedProducts();
  }

  editRow(row: any): void {
    console.log('Editing row:', row);
    // הוסף כאן את הלוגיקה לעריכת המוצר
  }
}
