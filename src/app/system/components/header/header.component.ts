import { Component, OnDestroy, OnInit } from '@angular/core';
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
