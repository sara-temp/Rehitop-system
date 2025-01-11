import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
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
    if (typeof localStorage === 'undefined') {
      console.log('LocalStorage is undefined');
      return of(false);
    }
    const token = localStorage.getItem('token');
    if (token==undefined) {
      console.log('No token found');
      return of(false);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('Headers:', headers);
  
    return this.http.get<boolean>(`${this.apiUrl}/is-admin`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error during isAdmin request:', error);
          return of(false);
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
