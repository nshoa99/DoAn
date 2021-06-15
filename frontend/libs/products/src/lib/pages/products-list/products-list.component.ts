/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import {Product} from '../../models/product';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit {
  categories: Category[] =[];
  products: Product[] = [];
  isCategoryPage: boolean | undefined;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      params.categoryId ? this._getProducts([params.categoryId]) : this._getProducts();
      params.categoryId ? (this.isCategoryPage = true) : (this.isCategoryPage = false)
    })
    
    this._getCategories();
  }


  private _getProducts(categoriesFilter?: string[]){
    this.productsService.getProducts(categoriesFilter).subscribe(resProducts => {
      this.products = resProducts;
    })
  }

  private _getCategories(){
    this.categoriesService.getCategories().subscribe(resCategories =>{
      this.categories = resCategories;
    })
  }

  categoryFilter(){
    const selectedCategories = this.categories
          .filter(category => category.checked)
          .map(category => category.id);
    
    this._getProducts(selectedCategories)
  }
}
