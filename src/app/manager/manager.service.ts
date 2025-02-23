import { Injectable } from '@angular/core';
import { Product, SubCategory } from '../models/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private jsonUrl = 'http://localhost:3001/products';

  constructor(private http: HttpClient) { }

  private getAuthorizationHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll = (): Observable<Product[]> => {
    return this.http.get<Product[]>(this.jsonUrl);
  }

  getByCategory = (category: string): Observable<Product[]> => {
    return this.http.get<Product[]>(this.jsonUrl).pipe(
      map((products) => {
        if (products) {
          return products
            .filter((prod) => prod.categories.some((cat) => cat === category))
            .sort((a, b) => {
              const aNiceImg = a.nice_img ?? false;
              const bNiceImg = b.nice_img ?? false;

              // מיון לפי nice_img תחילה (true לפני false)
              if (aNiceImg !== bNiceImg) {
                return bNiceImg ? 1 : -1;
              }

              // מיון לפי count_priority (אם חסר - מתייחסים כ- 0)
              const aPriority = a.count_priority ?? 0;
              const bPriority = b.count_priority ?? 0;

              return bPriority - aPriority;
            });
        } else {
          throw new Error('not found');
        }
      }),
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error('Error fetching products'));
      })
    );
  };

  getBySearchQuery = (searchQuery: string): Observable<Product[]> => {
    return this.http.get<Product[]>(this.jsonUrl).pipe(
      map((products) => {
        if (!products) throw new Error('not found');
        const normalizedQuery = this.normalizeString(searchQuery);
        const isExactMatch = normalizedQuery.length <= 3;
        return products.filter((prod) =>
          ['Id', 'name', 'categories', 'company', 'describe'].some((key) => {
            const value = prod[key as keyof Product];
            if (typeof value === 'string') {
              const normalizedValue = this.normalizeString(value);
              if (isExactMatch) {
                // בדיקה אם אחת המילים שווה בדיוק למילת החיפוש
                return normalizedValue.split(' ').some((word) => word === normalizedQuery);
              } else {
                return normalizedValue.includes(normalizedQuery);
              }
            } else if (Array.isArray(value)) {
              return value.some(
                (val) =>
                  typeof val === 'string' &&
                  (isExactMatch
                    ? this.normalizeString(val).split(' ').some((word) => word === normalizedQuery)
                    : this.normalizeString(val).includes(normalizedQuery))
              );
            }
            return false;
          })
        );
      }),
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error('Error fetching products'));
      })
    );
  };
  normalizeString(str: string): string {
    return str
      .toLowerCase()
      .replace(/[\u0591-\u05C7]/g, '')
      .trim();
  }

  getById = (id: string): Observable<Product | undefined> => {
    return this.http.get<Product[]>(`${this.jsonUrl}/${id}`).pipe(
      map((products) => {
        const product = products.find((prod) => prod.Id === id);
        if (!product) {
          throw new Error(`Product with ID ${id} not found`);
        }
        return product;
      })
    );
  }

  uploadImage(formData: FormData, folderPath: string): Observable<{ imagePath: string }> {
    return this.http.post<{ imagePath: string }>(`${this.jsonUrl}/upload-image?folder=${folderPath}`, formData, {
      // return this.http.post<{ imagePath: string }>(this.jsonUrl + '/upload-image', formData, {
      headers: this.getAuthorizationHeader()
    });
  }

  deleteImage(imagePath: string): Observable<void> {
    return this.http.post<void>(this.jsonUrl + '/delete-image', { imagePath }, {
      headers: this.getAuthorizationHeader()
    });
  }

  post = (product: Product): Observable<Product> => {
    product.count_priority = 0;
    return this.http.post<Product>(this.jsonUrl, product, {
      headers: this.getAuthorizationHeader()
    });
  };

  put = (product: Product, id: string): Observable<Product> => {
    product.Id = id;
    return this.http.put<Product>(`${this.jsonUrl}/${id}`, product, {
      headers: this.getAuthorizationHeader()
    });
  };

  delete(id: string): Observable<void> {
    console.log('delete(id: string): Observable<void>', id);
    return this.http.delete<void>(`${this.jsonUrl}/${id}`, {
      headers: this.getAuthorizationHeader()
    });
  }

  showSuccess(message: string) {
    Swal.fire({
      title: message,
      icon: 'success',
      confirmButtonText: 'סגור',
    });
  }
  showError(message: string) {
    Swal.fire({
      title: message,
      icon: 'error',
      confirmButtonText: 'סגור',
    });
  }
  deleteDialog(massege: String) {
    return Swal.fire({
      title: `?למחוק ${massege}`,
      text: "!לא תוכל לשחזר פעולה זו",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '!כן, מחק',
      cancelButtonText: 'בטל'
    });
  }
}
