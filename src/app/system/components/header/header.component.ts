import { Component, OnInit, HostListener } from '@angular/core';
import { SCHEMA_RUNTIME } from '../../../models/product.model';
import { AuthService } from '../../../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../../../manager/components/login/login.component';
import { ManagerService } from '../../../manager/manager.service';
import { SystemService } from '../../system.service';
import { firstValueFrom } from 'rxjs';

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
  selectedTab: MenuItem | null = null;
  searchQuery: string = '';
  errorMessage: string = ''; 
  selectLike: boolean = false;
  isMenuOpen = false;
  isMobile = false;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog, public _managerService: ManagerService, public _systemService: SystemService) {
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage)
      this.storedValue = localStorage.getItem('token');
    if (this.storedValue)
      this.isLogin = true;

    this.authService.refresh$.subscribe(
      (value: boolean) => {
        this.isLogin = value;
      },
      (err: any) => console.log('HeaderComponent ngOnInit error:', err)
    );

    this.items = this.generateMenuItems();
    this.selectedTab = this.items[0]; // ברירת מחדל לטאב הראשון

  }

  generateMenuItems(): MenuItem[] {
    const schemaData = SCHEMA_RUNTIME;

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
        }
      });
    };

    const menu = Object.entries(schemaData).map(([mainCategory, subCategories]) => {
      const subItems = buildSubItems(subCategories);
      return {
        label: mainCategory,
        items: subItems,
        command: (event: any) => this.onCategoryClick(mainCategory)
      };
    });
    // menu.push(loginObject, logoutObject, editObject)
    return menu;
  }

  selectTab(tab: MenuItem): void {
    this.selectedTab = tab;
  }

  async onSearch(): Promise<void> {
    if (/^[\s]*$/.test(this.searchQuery)) {
      return;
    }
    try {
      this._systemService.productList = await firstValueFrom(this._managerService.getBySearchQuery(this.searchQuery));
      console.log(this._systemService.productList);
      this.router.navigate([`category/${this.searchQuery}`]);
    } catch (error) {
      console.log('Failed to load products:', error);
    }
  }

  async onCategoryClick(category: string) {
    try {
      this._systemService.productList = await firstValueFrom(this._managerService.getByCategory(category));
      console.log(this._systemService.productList);
      this.router.navigate([`category/${category}`]);
    } catch (error) {
      console.log('Failed to load products:', error);
    }
  }

  isLoginFunc() {
    this.authService.isAdmin().subscribe(
      (value) => {
        this.isLogin = value
      },
      (error) => console.error('Error:', error));
  }

  onLoginClick() {
    this.loginSelected = true;
    this.categorySelected = '';
    this.dialog.open(LoginComponent, {
      width: '25vw',
      maxWidth: '100vw',
      panelClass: 'custom-dialog',
    })
  }

  onLogoutClick() {
    this.authService.logout();
    this.loginSelected = false;
    this.isLogin = false;
    this.items = this.generateMenuItems();
  }

  executeCommand(command: (event: MenuItemCommandEvent) => void, mouseEvent: MouseEvent, item: any) {
    mouseEvent.stopPropagation()
    const menuItemEvent: MenuItemCommandEvent = {
      originalEvent: mouseEvent,
      item: undefined
    };
    command(menuItemEvent);
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 935;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


}