import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from '../../../models/product.model';
import { AuthService } from '../../../service/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  categories: string[];
  categorySelected: string = '';
  loginSelected: boolean = false;
  isLogin: boolean = false;

  constructor(private authService: AuthService, private route: ActivatedRoute) {
    this.categories = Object.values(Category);
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let t = params.get('isLogin');
      console.log('isLogin', t)
      if (t === 'true') {
        this.isLogin = true;
      }
    })
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
    console.log('in onLogoutClick(){')
  }
}
