import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { Login } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3001';
  
  private refreshSubject = new BehaviorSubject<boolean>(false);
  refresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) { }


  isAdmin(): Observable<boolean> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<{ isAdmin: boolean }>(`${this.apiUrl}/is-admin`, { headers })
      .pipe(
        map(response => response.isAdmin),  // התאמה לתשובת השרת המחודשת
        catchError((error) => {
          console.error('Error during isAdmin request:', error);
          return of(false);  // החזרת false במקרה של שגיאה
        })
      );
}

  

  login(login: Login): Observable<any>{
    return this.http.post(this.apiUrl + '/login', login)
    .pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        console.log("login");
        this.refreshSubject.next(true);
      })
    );
  }

  logout(): void{
    localStorage.removeItem('token');
    console.log("logout");
    this.refreshSubject.next(false);
  }
}
