/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '@frontend/orders';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';
import { CartItem } from '@frontend/orders';


@Component({
  selector: 'products-product-page',
  templateUrl: './product-page.component.html',
  styles: [
  ]
})
export class ProductPageComponent implements OnInit, OnDestroy {
  product: any;
  endSubs$: Subject<any> = new Subject;
  quantity: any = 1;
  constructor(
      private productsService: ProductsService,
      private route: ActivatedRoute,
      private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params.productId) {
        this._getProduct(params.productId);
      }
    })
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  // old
  addProductToCart() {
    const cartItem : CartItem = {
      productId: this.product.id,
      quantity: this.quantity
    }
    this.cartService.setCartItem(cartItem);
  }

  private _getProduct(id: string){
    this.productsService.getProduct(id).pipe(takeUntil(this.endSubs$)).subscribe(resProduct => {
      this.product = resProduct;
    })
  }
     
}
