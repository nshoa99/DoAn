/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import {environment} from '../../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  apiIRLCategories = environment.apiURL + 'categories';

  constructor(private http: HttpClient) { 

  }
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiIRLCategories);
  }

  getCategory(categoryId: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiIRLCategories}/${categoryId}`);
  }

  createCategory(category: Category): Observable<Category>{
    return this.http.post<Category>(this.apiIRLCategories, category);
  }

  updateCategory(category: Category): Observable<Category>{
    return this.http.put<Category>(`${this.apiIRLCategories}/${category.id}`, category);
  }
  deleteCategory(categoryId: string): Observable<any>{
    return this.http.delete<any>(`${this.apiIRLCategories}/${categoryId}`);
  }

}
