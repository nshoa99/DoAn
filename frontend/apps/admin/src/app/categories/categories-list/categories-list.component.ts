/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CategoriesService, Category} from '@frontend/products'
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'admin-categories-list',
  templateUrl: './categories-list.component.html',

})
export class CategoriesListComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  endsubs$ : Subject<any> = new Subject();

  constructor(
              private categoriesServics: CategoriesService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private router: Router) { }

  ngOnInit(): void {
    this._getCategories();
  }

  ngOnDestroy() {
    this.endsubs$.next;
    this.endsubs$.complete();
  }

  deleteCategory(categoryId: string) {

    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa danh mục sản phẩm này không?',
      header: 'Xóa danh mục sản phẩm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriesServics.deleteCategory(categoryId).pipe(takeUntil(this.endsubs$)).subscribe(response=>{
          this._getCategories();
          this.messageService.add({severity:'success', summary:'Thành công', detail:'Đã xóa thành công.'});
        },
        (error) => {
          this.messageService.add({severity:'error', summary:'Lỗi', detail:'Không thể xóa danh mục sản phẩm!'});
        })
      },
      reject: (type: any) => {
      }
  });
  }

  updateCategory(categoryId: string) {
    this.router.navigateByUrl(`categories/form/${categoryId}`)
  }

  private _getCategories() {
    this.categoriesServics.getCategories().pipe(takeUntil(this.endsubs$)).subscribe(cats => {
      this.categories = cats;
    })
  }
}
