import { Component, Inject } from '@angular/core';
import { Categories, ChildrensRoom, Closets, companies, DiningAreas, Mattresses, Office, Product, Salon, SCHEMA_RUNTIME, SubCategory } from '../../../models/product.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ManagerService } from '../../manager.service';
import Swal from 'sweetalert2';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'product-form',
  standalone: false,

  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  [x: string]: any;
  product: Product | undefined;
  categoryOptions!: TreeNode[];
  productForm: FormGroup = new FormGroup({});
  submitted = false;
  productNew = false;
  img: any;
  imgFile: any;
  category: any;
  imgFiles!: File[];
  images: string[] = [];
  companies = companies;

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

    if (this.product?.categories?.length) {
      this.productForm.patchValue({
        categories: [...this.product.categories]
      });
    }

    this.categoryOptions = this.generateCategoryOptions()
  }

  generateCategoryOptions(): { label: string; children?: { label: string; children?: { label: string }[] }[] }[] {
    const schemaData = SCHEMA_RUNTIME;

    const buildSubItems = (subCategories: any): { label: string; children?: { label: string; children?: { label: string }[] }[] }[] | undefined => {
      if (!subCategories || typeof subCategories !== 'object') return undefined;

      return Object.entries(subCategories).map(([subCategory, nestedSubCategories]) => {
        return {
          label: typeof nestedSubCategories === 'string' ? nestedSubCategories : subCategory,
          children: typeof nestedSubCategories === 'object' ? buildSubItems(nestedSubCategories) : undefined
        };
      });
    };

    const categoryOptions = Object.entries(schemaData).map(([mainCategory, subCategories]) => {
      const children = buildSubItems(subCategories);
      return {
        label: mainCategory,
        children
      };
    });
    return categoryOptions;
  }

  initializeForm() {
    this.productForm = new FormGroup({
      name: new FormControl(this.product?.name || '', Validators.required),
      image: new FormControl(this.product?.image || ''),
      categories: new FormControl(this.product?.categories || '', Validators.required),
      price: new FormControl(this.product?.price || '', [Validators.required, Validators.min(0)]),
      describe: new FormControl(this.product?.describe || ''),
      company: new FormControl(this.product?.company || ''),
      colors: new FormControl(this.product?.colors || ''),
    });
  }


  uploadImage(): Promise<any> {
    return new Promise((resolve, reject) => {
      const imageFormData = new FormData();
      imageFormData.append('image', this.imgFile);
      this.category = Object.keys(Categories).find(key => Categories[key as keyof typeof Categories] === this.productForm.value.categories[0]);
      console.log("this.category: "+this.category);
      
      this._managerService.uploadImage(imageFormData, this.category).subscribe(response => {
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
      console.log('הנתונים נמחקו בהצלחה', response);
    }, error => {
      console.error('שגיאה במחיקת הנתונים', error);
    });
  }


  removeCategory(categoryData: string): void {
    const updatedCategories = this.productForm.controls['categories'].value.filter((c: string) => c !== categoryData);
    this.productForm.patchValue({ categories: updatedCategories });
  }

  // מחיקת קטגוריה ישירות מה-p-treeselect
  onCategoryRemove(category: any, event: Event): void {
    event.stopPropagation(); // מונע את פתיחת ה-`p-treeselect`
    // לוגיקה להסרת הקטגוריה
    console.log('Removing category:', category);
    const selectedCategories = this.productForm.controls['categories'].value;
    const updatedCategories = selectedCategories.filter((c: string) => c !== category);
    this.productForm.patchValue({ categories: updatedCategories });
  }

  async readImagesFromFiles(files: FileList): Promise<string[]> {
    const imagesArray: string[] = [];
    const promises: Promise<void>[] = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log('readImagesFromFiles const file: '+file)
  
      if (file.type.startsWith('image/')) {
        const promise = new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageData = reader.result as string;
            console.log('readImagesFromFiles imageData:', imageData);
            imagesArray.push(imageData);
            resolve();
          };
          reader.onerror = () => {
            console.error(`Failed to read file: ${file.name}`);
            reject();
          };
          reader.readAsDataURL(file)
        });
  
        promises.push(promise);
      } else {
        console.warn(`File ${file.name} is not an image.`);
      }
    }
  
    await Promise.all(promises);
    return imagesArray;
  }
  
  onImageChange(event: any): void {
    this.imgFile = event.target.files[0];
    if (this.imgFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.img = reader.result as string;
        console.log('onImageChange imageData:', this.img);
      };
      console.log('this.imgFile befor'+this.imgFile)
      reader.readAsDataURL(this.imgFile);
      console.log('this.imgFile after'+this.imgFile)
    }
  }

  onImageChangeMany(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      this.imgFiles = Array.from(input.files);
      console.log('this.imgFile: '+this.imgFiles)
      this.readImagesFromFiles(input.files).then((images) => {
        this.images = images;
        console.log('Uploaded images:', this.images);
        console.log("קבצים שנבחרו:", this.imgFiles);
      })
    }
  }

  onCompanyChange(event: any): void {
    const selectedCompanyName = event.target.value;
    const selectedCompany = this.companies.find(company => company.name === selectedCompanyName);
    if (selectedCompany) {
      this.productForm.patchValue({
        company: selectedCompany.name,
        colors: selectedCompany.colors
      });
    }
  }

  async onSubmitArray() {
    for (const imgFile of this.imgFiles) {
      this.productForm.patchValue({ image: imgFile.name });
      this.imgFile = imgFile;
      this.onSubmit();
    }
  }

  async onSubmit() {
    this.submitted = true;
    let categories = [...new Set(this.productForm.controls['categories'].value.map((category: TreeNode | string) =>
      typeof category === 'string' ? category : category.label
    ))];
    if (this.productForm?.valid) {
      console.log('הטופס תקין', this.productForm.value);
      this.productForm.patchValue({ categories: categories });
      if (this.productNew) {
        try {
          await this.uploadImage();
          this._managerService.post(this.productForm.value).subscribe(response => {
            console.log('הנתונים נוספו בהצלחה', response);
            this._managerService.showSuccess('!הנתונים נוספו בהצלחה');
          }, error => {
            console.error('שגיאה בשליחת הנתונים', error);
            this._managerService.showError('!שגיאה בשליחת הנתונים');
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
          this._managerService.showSuccess('!הנתונים נערכו בהצלחה');
        }, error => {
          console.error('שגיאה בעריכת הנתונים', error);
          this._managerService.showError('!שגיאה בעריכת הנתונים');
        });
      }
      else {
        console.log("error!!");
      }
      this.dialog.closeAll();
    }
    else {
      console.log('הטופס לא תקין', this.productForm.value);
    }
  }

  showErrorMessage() {
    alert('יש להשלים את כל שדות החובה לפני שליחת הטופס.');
  }

  onCancel() {
    this.dialog.closeAll();
  }
}
