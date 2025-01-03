import { Injectable } from '@angular/core';
import { Product } from '../models/product.model'
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private jsonUrl = 'http://localhost:3001/products';

  constructor(private http: HttpClient) { }

  getAll = (): Observable<Product[]> => {
    return this.http.get<Product[]>(this.jsonUrl)
  }

  getByCategory = (category: string): Observable<Product[]> => {
    return this.http.get<Product[]>(this.jsonUrl).pipe(
      map((products) => {
        if (products) {
          return products.filter((prod) =>
            prod.categories.some((cat) => cat === category)
          );
        } else {
          throw new Error('not found');
        }
      }),
      catchError((error) => {
        console.error(error);
        return throwError(() => new Error('Error fetching products'));
      })
    );
  }
  
  getById = (id: string): Observable<Product | undefined> => {
    return this.http.get<Product[]>(`this.jsonUrl/${id}`).pipe(
      map((products) => {
        const product = products.find((prod) => prod.Id === id);
        if (!product) {
          throw new Error(`Product with ID ${id} not found`);
        }
        return product;
      })
    );
  }
  
  uploadImage(formData: FormData): Observable<{ imagePath: string }> {
    return this.http.post<{ imagePath: string }>(this.jsonUrl + '/upload-image', formData);
  }

  deleteImage(imagePath: string): Observable<void> {
    return this.http.post<void>(this.jsonUrl + '/delete-image', { imagePath });
  }  

  post = (product: Product): Observable<Product> => {
    product.Id = uuidv4(); 
    return this.http.post<Product>(this.jsonUrl, product);
  };

  put = (product: Product, id:string): Observable<Product> => {
    product.Id = id; 
    return this.http.put<Product>(`${this.jsonUrl}/${id}`, product);
  };

  delete = (id: string): Observable<void> => {
    const data = this.http.delete<void>(`${this.jsonUrl}/${id}`);
    data.subscribe({
      next: () => console.log('2 Delete successful (manager service)'),
      error: (err) => console.error('2 Delete failed:', err, '(manager service)'),
      complete: () => console.log('2 Request completed (manager service)'),
    });
    return data;
  };
}