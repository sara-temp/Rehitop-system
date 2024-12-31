import { Component, OnInit } from '@angular/core';
import { Category } from '../../../models/product.model';
import { AuthService } from '../../../service/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent{
  categories: string[];
  categorySelected: string = '';
  loginSelected: boolean = false;
  isLogin: boolean = false;

  constructor(private authService: AuthService, private route: ActivatedRoute) {
    this.categories = Object.values(Category);
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
  }
}
