import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Login } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3001';
  constructor(private http: HttpClient) { }

  isAdmin(): Observable<boolean>{
    let token = localStorage.getItem('token')
    if (!token)
      return of(false)
    const headers = new  HttpHeaders().set('authorization', `bearer${token}`)
    return this.http.get<boolean>(this.apiUrl + '/isadmin');
  }

  login(login: Login): Observable<any>{
    return this.http.post(this.apiUrl + '/login', login)
    .pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  logout(): void{
    localStorage.removeItem('token');
  }
}
