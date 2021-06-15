/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService, ORDER_STATUS } from '@frontend/orders';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'admin-orders-list',
  templateUrl: './orders-detail.component.html',
  styles: [
  ]
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
  order: Order; 
  orderStatuses = [] as any;
  selectedStatus :any;
  endsubs$ : Subject<any> = new Subject();

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this._mapOrderStatus();
    this._getOrder();
  }

  ngOnDestroy() {
    this.endsubs$.next;
    this.endsubs$.complete();
  }

  private _mapOrderStatus(){
    this.orderStatuses =  Object.keys(ORDER_STATUS).map(key => {
      return {
        id: key,
        name: ORDER_STATUS[key].label
      };
    });
  }

  private _getOrder() {
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe(params => {
      if(params.id){
        this.ordersService.getOrder(params.id).subscribe(order => {
          this.order = order
          this.selectedStatus = order.status;
        })
      }
    })
  }

  onStatusChange(event: any) {
    this.ordersService.updateOrder({status: event.value}, this.order.id).pipe(takeUntil(this.endsubs$)).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Cập nhật thành công'
      });
    }, ()=>{
      this.messageService.add(
        {
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể cập nhật'}
      );
    })
  }
}
