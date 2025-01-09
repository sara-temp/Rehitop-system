import { Component, OnDestroy, OnInit } from '@angular/core';
import { Schema, Categories, ChildrensRoom, Closets, DiningAreas, MainCategory, Mattresses, Office, Salon, SubCategory } from '../../../models/product.model';
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
  items: MenuItem[] | undefined;

  constructor(private authService: AuthService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let t = params.get('isLogin');
      // console.log('isLogin', t)
      if (t === 'true') {
        this.isLogin = true;
      }
    })

    this.items = this.generateMenuItems();
  }

  generateMenuItems(): MenuItem[] {
    const schemaData = {
      [Categories.SALON]: Salon,
      [Categories.BEDROOMS]: null,
      [Categories.MATTRESSES]: Mattresses,
      [Categories.CHILDRENSROOMS]: ChildrensRoom,
      [Categories.CLOSETS]: Closets,
      [Categories.DININGAREAS]: DiningAreas,
      [Categories.OFFICE]: Office
    };

    const loginObject = {
      label: 'Login',
      icon: 'pi pi-sign-in',
      items:undefined,
      command: (event: MenuItemCommandEvent) => {
        // this.onLoginClick();
        this.loginSelected = true;
        this.categorySelected='';
      },
      visible: !this.isLogin
    }

    const logoutObject = {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      items:undefined,
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

    // return
    let menu =  Object.entries(schemaData).map(([mainCategory, subCategories]) => {
      const subItems = subCategories
        ? Object.values(subCategories).map(subCategory => ({
          label: subCategory,
          command: () => this.onCategoryClick(subCategory),
        }))
        : undefined;

      let lengthSubItem = subItems ? subItems.length : 0
      return {
        label: mainCategory,
        items: subItems,
        command: (event:any) => this.onMainCategoryClick(event, mainCategory, lengthSubItem)
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
      console.log(event.originalEvent)
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
