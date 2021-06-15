/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Category, Product, ProductsService } from '@frontend/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-product-form',
  templateUrl: './product-form.component.html',
  styles: [
  ]
})
export class ProductFormComponent implements  OnInit, OnDestroy {
  endsubs$ : Subject<any> = new Subject();
  editMode = false;
  form: FormGroup;
  isSubmitted = false;
  categories : Category[] = [];
  imageDisplay: string | undefined | ArrayBuffer | null;
  currentProductId: string;

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._getCategories();
    this._checkEditMode();
  }

  ngOnDestroy() {
    this.endsubs$.next;
    this.endsubs$.complete();
  }

  private _initForm(){
    this.form = this.formBuilder.group(
      {
        name: ['', Validators.required],
        brand: ['', Validators.required],
        price: ['', Validators.required],
        category: ['', Validators.required],
        countInStock: ['', Validators.required],
        description: ['', Validators.required],
        richDescription: [''],
        image: ['', Validators.required],
        isFeatured: [false],
      }
    )
  }

  private _getCategories() {
    this.categoriesService.getCategories().pipe(takeUntil(this.endsubs$)).subscribe(categories => {
      this.categories = categories;
    })
  }

  private _addProduct(productData: FormData){
    this.productsService.createProduct(productData).pipe(takeUntil(this.endsubs$)).subscribe((product: Product) => {
      this.messageService.add({severity:'success', summary:'Thành công', detail:`Đã tạo ${product.name}`});
      timer(2000).toPromise().then(() => {
        this.location.back();
      })
    },
    () => {
      this.messageService.add({severity:'error', summary:'Lỗi', detail:'Không thể tạo sản phẩm!'});
    });
  }

  private _updateProduct(productFormData: FormData) {
    this.productsService.updateProduct(productFormData, this.currentProductId).pipe(takeUntil(this.endsubs$)).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Cập nhật thành công.'
        });
        timer(2000)
          .toPromise()
          .then(() => {
            this.location.back();
          });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể cập nhật!'
        });
      }
    );
  }


  get productForm() {
    return this.form.controls;
  }


  private _checkEditMode() {
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe(params => {
      if(params.id) {
        this.editMode = true;
        this.currentProductId = params.id;
        this.productsService.getProduct(params.id).subscribe((product) => {
          this.productForm.name.setValue(product.name);
          this.productForm.price.setValue(product.price);
          this.productForm.category.setValue(product.category?.id);
          this.productForm.brand.setValue(product.brand);
          this.productForm.countInStock.setValue(product.countInStock);
          this.productForm.isFeatured.setValue(product.isFeatured);
          this.productForm.description.setValue(product.description);
          this.productForm.richDescription.setValue(product.richDescription);
          this.imageDisplay = product.image;
          this.productForm.image.setValidators([]);
          this.productForm.image.updateValueAndValidity();
        })
      }
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if(this.form.invalid)
    return;

    const productFormData = new FormData();

    Object.keys(this.productForm).map((key) => {
      productFormData.append(key, this.productForm[key].value);
    })

    if(this.editMode) {
      this._updateProduct(productFormData)
    }
    else{
      this._addProduct(productFormData)
    }
    
    
  }

  
  onCancle(){
    this.location.back();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onImageUpload(event : any) {
    const file = event.target.files[0];
    if(file) { 
      this.form.patchValue({image: file});
      this.form.get('image')?.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result;
      }
      fileReader.readAsDataURL(file);
    }
  }

}
