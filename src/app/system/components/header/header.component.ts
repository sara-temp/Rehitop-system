import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Categories, ChildrensRoom, Closets, DiningAreas, MainCategory, Mattresses, Office, Salon, SubCategory } from '../../../models/product.model';
import { AuthService } from '../../../service/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  categories: MainCategory[];
  subCategory!: SubCategory[];
  categorySelected: string = '';
  loginSelected: boolean = false;
  isLogin: boolean = false;
  storedValue: string | null | undefined;

  constructor(private authService: AuthService, private route: ActivatedRoute) {
    this.categories = Object.values(Categories);
    this.subCategory = [
      ...Object.keys(Salon),           // מפתחות של Salon
      ...Object.keys(Mattresses),      // מפתחות של Mattresses
      ...Object.keys(ChildrensRoom),   // מפתחות של ChildrensRoom
      ...Object.keys(Closets),         // מפתחות של Closets
      ...Object.keys(DiningAreas),     // מפתחות של DiningAreas
      ...Object.keys(Office),          // מפתחות של Office
    ] as SubCategory[];               // המרה למערך של SubCategory[]
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage)
      this.storedValue = localStorage.getItem('token');
    console.log("this.storedValue: " + this.storedValue);
    if (this.storedValue)
      this.isLogin = true;
    console.log("this.isLogin: " + this.isLogin);
    
    this.authService.refresh$.subscribe(
      (value: boolean) => {
        this.isLogin = value;
      },
      (err: any) => console.log('HeaderComponent ngOnInit error:', err)
    );
  }

  onCategoryClick(category: string) {
    this.categorySelected = category;
    this.loginSelected = false;
  }

  isLoginFunc() {
    this.authService.isAdmin().subscribe(
      (value) => {
        this.isLogin = value,
          console.log('Header', value)
      },
      (error) => console.error('Error:', error));
  }

  onLoginClick() {
    this.loginSelected = true;
  }

  onLogoutClick() {
    this.authService.logout();
    this.loginSelected = false;
    this.isLogin = false;
  }
}
