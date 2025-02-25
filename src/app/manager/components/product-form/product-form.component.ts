import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { Categories, ChildrensRoom, Closets, companies, Company, DiningAreas, Mattresses, Office, Product, Salon, SCHEMA_RUNTIME, SubCategory } from '../../../models/product.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  isUploading = false;

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: { product: Product }, private _managerService: ManagerService, public dialog: MatDialog) {
    if (data.product) {
      this.product = data.product;
      this.img = data.product.image;
    }
    else
      this.productNew = true;
    console.log('productNew', this.productNew)
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

  generateCategoryOptions(): TreeNode[] {
    const schemaData = SCHEMA_RUNTIME;

    const buildSubItems = (subCategories: Record<string, any>, parent?: TreeNode): TreeNode[] | undefined => {
      if (!subCategories || typeof subCategories !== 'object') return undefined;

      return Object.entries(subCategories).map(([subCategory, nestedSubCategories]) => {
        const node: TreeNode = {
          label: typeof nestedSubCategories === 'string' ? nestedSubCategories : subCategory,
          parent
        };
        node.children = typeof nestedSubCategories === 'object' ? buildSubItems(nestedSubCategories, node) : undefined;
        return node;
      });
    };

    const categoryOptions: TreeNode[] = Object.entries(schemaData).map(([mainCategory, subCategories]) => {
      const node: TreeNode = {
        label: mainCategory,
        children: buildSubItems(subCategories as Record<string, any>)
      };
      return node;
    });

    return categoryOptions;
  }
  initializeForm() {

    const price = this.fb.array(
      (this.product?.price || []).map(p => 
        this.fb.group({
          description: new FormControl(p.description || '', Validators.required),
          amount: new FormControl(p.amount || 0, [Validators.required, Validators.min(0)]),
        })
      )
    )

    this.productForm = new FormGroup({
      name: new FormControl(this.product?.name || ''),
      image: new FormControl(this.product?.image || ''),
      categories: new FormControl(this.product?.categories || '', Validators.required),
      price: this.fb.array(this.product?.price?.map(p => this.createPriceFormGroup(p)) || []),  // ממירים את המחירים ל-FormArray
      describe: new FormControl(this.product?.describe || ''),
      sizes: new FormControl(this.product?.sizes || ''),
      company: new FormControl(this.product?.company || ''),
      colors: new FormControl(this.product?.colors || ''),
      nice_img: new FormControl(this.product?.nice_img || false),
      date: new FormControl(new Date()) 
    });
  }

  uploadImage(): Promise<any> {
    return new Promise((resolve, reject) => {
      const imageFormData = new FormData();
      imageFormData.append('image', this.imgFile);
      const productCategories = this.productForm.value.categories;
      this.category = Object.entries(Categories).find(([key, value]) =>
        productCategories.includes(value) // בדיקה אם הערך (עברית) נמצא במערך הקטגוריות
      )?.[0];
      this._managerService.uploadImage(imageFormData, this.category).subscribe(response => {
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
      console.error('7 שגיאה במחיקת הנתונים', error);
    });
  }

  compareCompanies(company1: Company, company2: Company): boolean {
    return company1 && company2 ? company1.name === company2.name : company1 === company2;
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
      console.log('readImagesFromFiles const file: ' + file)

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
        if (this.images.length>0) {
          this.images.push(this.img) 
          this.img = null;
        }
      };
      reader.readAsDataURL(this.imgFile);
    }
  }

  onImageChangeMany(event: any): void {
    this.isUploading = true;
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      this.imgFiles = Array.from(input.files);
      console.log('this.imgFile: ' + this.imgFiles)
      this.readImagesFromFiles(input.files).then((images) => {
        if (this.img) {
          this.images.push(this.img) 
          this.img = null;
        }
        
        images.forEach(i => this.images.push(i));
        this.isUploading = false;
      })
    }
  }

  onCompanyChange(event: any): void {
    const selectedCompanyName = event.target.value;
    const selectedCompany = this.companies.find(company => company.name === selectedCompanyName);
    if (selectedCompany) {
      this.productForm.patchValue({
        company: selectedCompany
      });
    }
  }

  async onSubmitArray() {
    this.submitted = true;
    console.log('onSubmitArray:: this.img', this.img, '\nthis.images', this.images);
    for (const imgFile of this.imgFiles) {
      this.productForm.patchValue({ image: imgFile.name });
      this.imgFile = imgFile;
      this.onSubmit();
    }
  }

  async onSubmit() {
    console.log('onSubmit', this.productForm.value);
    this.submitted = true;
    let categories = [...new Set(this.productForm.controls['categories'].value.flatMap((category: TreeNode | string) => {
      if (typeof category === 'string') {
        return category;
      } else {
        const labels = [];
        let current: TreeNode | undefined = category;
        while (current) {
          labels.push(current.label);
          current = current.parent;
        }
        return labels;
      }
    }))];

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

  onCancel() {
    this.dialog.closeAll();
  }

  deleteImageFromForm(image: any) {
    this.images = this.images.filter(img => img !== image);
  }

  get firstImages(): string[] {
    return this.images.length > 7 ? this.images.slice(0, 5) : this.images;
  }

  get lastImages(): string[] {
    return this.images.length > 7 ? this.images.slice(-2) : [];
  }
  
  createPriceFormGroup(price = { description: '', amount: 0 }) {
    return this.fb.group({
      description: [price.description, Validators.required],
      amount: [price.amount, [Validators.required, Validators.min(0)]]
    });
  }

  // פונקציה להוספת שורה של מחיר
  addPrice() {
    const priceFormGroup = this.createPriceFormGroup();
    (this.productForm.get('price') as FormArray).push(priceFormGroup);  // הוספת שורת מחיר חדשה
  }

  // פונקציה להסרת שורה של מחיר
  removePrice(index: number) {
    (this.productForm.get('price') as FormArray).removeAt(index);  // הסרת שורת מחיר
  }

  // פונקציה למעבר למחירים
  get prices(): FormArray {
    return this.productForm.get('price') as FormArray;
  }
}

