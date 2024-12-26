import { Component, Inject } from '@angular/core';
import { Product, Category } from '../../../models/product.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ManagerService } from '../../manager.service';

@Component({
  selector: 'product-form',
  standalone: false,

  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  product: Product | undefined;
  categoryOptions: string[] = Object.values(Category);
  productForm: FormGroup = new FormGroup({});
  submitted = false;
  productNew = false;
  img: any;
  imgFile: any;
  category: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { product: Product }, private _managerService: ManagerService, public dialog: MatDialog) {
    if (data.product) {
      this.product = data.product;
      this.img = data.product.image;
    }
    else
      this.productNew = true;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.productForm = new FormGroup({
      name: new FormControl(this.product?.name || '', Validators.required),
      image: new FormControl(this.product?.image || '', Validators.required),
      categories: new FormControl(this.product?.categories || '', Validators.required),
      price: new FormControl(this.product?.price || '', [Validators.required, Validators.min(0)]),
      describe: new FormControl(this.product?.describe || ''),
      colors: new FormControl(this.product?.colors || ''),
      company: new FormControl(this.product?.company || '')
    });
  }

  onImageChange(event: any): void {
    this.imgFile = event.target.files[0];
    if (this.imgFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.img = reader.result as string;
      };
      reader.readAsDataURL(this.imgFile);
    }
  }

  uploadImage(): Promise<any> {
    return new Promise((resolve, reject) => {
      const imageFormData = new FormData();
      imageFormData.append('image', this.imgFile);
      this.category = Object.keys(Category).find(key => Category[key as keyof typeof Category] === this.productForm.value.categories[0]);
      if (this.category)
        imageFormData.append('folder', this.category);
      this._managerService.uploadImage(imageFormData).subscribe(response => {
        console.log("response:", response.imagePath);
        this.productForm.patchValue({ image: response.imagePath });
        this.img = null;
        resolve(response);
      }, error => {
        console.error('שגיאה בהעלאת התמונה', error);
        reject(error);
      });
    });
  }

  deleteImage(imagePath: string) {
    this._managerService.deleteImage(imagePath).subscribe(response => {
      console.log('הנתונים נוספו בהצלחה', response);
    }, error => {
      console.error('שגיאה בשליחת הנתונים', error);
    });
  }

  async onSubmit() {
    this.submitted = true;
    if (this.productForm?.valid) {
      console.log('הטופס תקין', this.productForm.value);
      if (this.productNew) {
        try {
          await this.uploadImage();
          this._managerService.post(this.productForm.value).subscribe(response => {
            console.log('הנתונים נוספו בהצלחה', response);
          }, error => {
            console.error('שגיאה בשליחת הנתונים', error);
          });
        } catch (error) {
          console.error("שגיאה בהעלאת התמונה, לא ניתן להמשיך", error);
        }
      }
      else if (this.product) {
        if (this.img != this.productForm.value.image) {
          try {
            await this.deleteImage(this.productForm.value.image);
            await this.uploadImage();
          } catch (error) {
            console.error("שגיאה בהעלאת התמונה, לא ניתן להמשיך", error);
            return;
          }
        }
        this._managerService.put(this.productForm.value, this.product.Id).subscribe(response => {
          console.log('הנתונים נערכו בהצלחה', response);
        }, error => {
          console.error('שגיאה בשליחת הנתונים', error);
        });
      }
      else {
        console.log("error!!");
      }
      this.dialog.closeAll();
    }
  }

  onCancel() {
    this.dialog.closeAll();
  }
}
