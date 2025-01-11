import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Schema, Categories, ChildrensRoom, Closets, DiningAreas, MainCategory, Mattresses, Office, Salon, SubCategory, SCHEMA_RUNTIME } from '../../../models/product.model';
import { AuthService } from '../../../service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';

@Component({
  selector: 'header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  categorySelected: string = '';
  loginSelected: boolean = false;
  isLogin: boolean = false;
  storedValue: string | null | undefined;
  items: MenuItem[] | undefined;


  constructor(private authService: AuthService, private route: ActivatedRoute) {
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
   
    this.authService.refresh$.subscribe(
      (value: boolean) => {
        this.isLogin = value;
      },
      (err: any) => console.log('HeaderComponent ngOnInit error:', err)
    );

    this.items = this.generateMenuItems();
  }

  generateMenuItems(): MenuItem[] {
    const schemaData = SCHEMA_RUNTIME;

    const loginObject = {
      label: 'Login',
      icon: 'pi pi-sign-in',
      items: undefined,
      command: (event: MenuItemCommandEvent) => {
        // this.onLoginClick();
        this.loginSelected = true;
        this.categorySelected = '';
      },
      visible: !this.isLogin
    }

    const logoutObject = {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      items: undefined,
      command: (event: MenuItemCommandEvent) => {
        this.onLogoutClick();
        this.loginSelected = false;
        this.items = this.generateMenuItems();
      },
      visible: this.isLogin
    }

    const editObject = {
      label: 'לעריכה',
      icon: 'pi-pen-to-square',
      items: undefined,
      routerLink: '/edit',
      command: (event: MenuItemCommandEvent) => {
        this.onLogoutClick();
        this.loginSelected = false;
      },
      visible: this.isLogin
    }

    const buildSubItems = (subCategories: any): MenuItem[] | undefined => {
      if (!subCategories || typeof subCategories !== 'object') return undefined;

      return Object.entries(subCategories).map(([subCategory, nestedSubCategories]) => {
        const label = typeof nestedSubCategories === 'string' ? nestedSubCategories : subCategory;
        return {
        label,
        items: typeof nestedSubCategories === 'object' && nestedSubCategories !== null
          ? buildSubItems(nestedSubCategories)
          : undefined,
        command: () => this.onCategoryClick(label)
      }});
    };

    const menu = Object.entries(schemaData).map(([mainCategory, subCategories]) => {
      const subItems = buildSubItems(subCategories);
      return {
        label: mainCategory,
        items: subItems,
        command: (event: any) => this.onMainCategoryClick(event, mainCategory, subItems?.length ?? 0)
      };
    });

    menu.push(loginObject, logoutObject, editObject)
    return menu;
  }


  onMainCategoryClick(event: MenuItemCommandEvent, mainCategory: string, length: number): any {

    const originalEvent = event.originalEvent;

    if (!originalEvent) {
      return;
    }

    const targetElement = originalEvent.target as HTMLElement;

    targetElement.addEventListener('dblclick', () => {
      this.onCategoryClick(mainCategory);
    });

    if (event.originalEvent?.type == 'click' && length) {
      return;
    }

    return this.onCategoryClick(mainCategory);
  }

  onCategoryClick(category: string) {
    console.log(category)
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
