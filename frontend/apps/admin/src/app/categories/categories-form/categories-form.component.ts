/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService, Category } from '@frontend/products';
import { MessageService } from 'primeng/api';
import { Subject, timer } from 'rxjs';
import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';



@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: []
})
export class CategoriesFormComponent implements OnInit, OnDestroy{
  endsubs$ : Subject<any> = new Subject();
  form: FormGroup;
  isSubmitted: boolean = false;
  editMode: boolean = false;
  currentCategoryId : string;
  
  constructor(private formBuilder: FormBuilder,
              private categoriesService: CategoriesService,
              private messageService: MessageService,
              private location: Location,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color:['#fff']
    });

    this._checkEditMode();
  }

  ngOnDestroy() {
    this.endsubs$.next;
    this.endsubs$.complete();
  }

  onSubmit() {
    this.isSubmitted = true;
    if(this.form.invalid){
      return;
    }

    const category : Category = {
      id: this.currentCategoryId,
      name: this.categoryForm.name.value,
      icon: this.categoryForm.icon.value, 
      color: this.categoryForm.color.value
    };

    if(this.editMode) {
      this._updateCategory(category);
    }
    else {
      this._addCategory(category);
    }
  }

  onCancle() {
    this.location.back();
  }


  private _addCategory(category: Category){
    this.categoriesService.createCategory(category).pipe(takeUntil(this.endsubs$)).subscribe(response => {
      this.messageService.add({severity:'success', summary:'Thành công', detail:`Đã tạo ${category.name}`});
      timer(2000).toPromise().then(done => {
        this.location.back();
      })
    },
    (error) => {
      this.messageService.add({severity:'error', summary:'Lỗi', detail:'Không thể tạo danh mục sản phẩm!'});
    });
  }

  private _updateCategory(category: Category) {
    this.categoriesService.updateCategory(category).pipe(takeUntil(this.endsubs$)).subscribe(response => {
      this.messageService.add({severity:'success', summary:'Thành công', detail:'Đã cập nhật danh mục sản phẩm.'});
      timer(2000).toPromise().then(done => {
        this.location.back();
      })
    },
    (error) => {
      this.messageService.add({severity:'error', summary:'Lỗi', detail:'Không thể cập nhật danh mục sản phẩm!'});
    });
  }

  private _checkEditMode() {
    this.route.params.subscribe(params => {
      if(params.id) {
        this.editMode = true;
        this.currentCategoryId = params.id;
        this.categoriesService.getCategory(params.id)
          .pipe(takeUntil(this.endsubs$))
          .subscribe(category => {
          this.categoryForm.name.setValue(category.name);
          this.categoryForm.icon.setValue(category.icon);
          this.categoryForm.color.setValue(category.color);
        })
      }
    });
  }

  get categoryForm() { 
    return this.form.controls;
  }

  

}
