import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
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
    product.Id = uuidv4();
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
