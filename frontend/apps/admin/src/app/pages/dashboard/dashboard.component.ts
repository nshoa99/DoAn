/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@frontend/orders';
import { ProductsService } from '@frontend/products';
import { UsersService } from '@frontend/users';
import { combineLatest } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
  
})
export class DashboardComponent implements OnInit, OnDestroy {
  statistics = [] as any;
  endsubs$ : Subject<any> = new Subject();
  constructor(
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.ordersService.getOrdersCount(),
      this.productsService.getProductsCount(),
      this.usersService.getUsersCount(),
      this.ordersService.getTotalSales(),
    ]).pipe(takeUntil(this.endsubs$)).subscribe(values=>{
      this.statistics = values;
    })

  }
  
  ngOnDestroy() {
    this.endsubs$.next;
    this.endsubs$.complete();
  }

}
