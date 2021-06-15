/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '@frontend/orders';
import {Product} from '../../models/product';


@Component({
  selector: 'products-product-item',
  templateUrl: './product-item.component.html',
  styles: [
  ]
})
export class ProductItemComponent implements OnInit {
  @Input() product: any;
  constructor(private cartService: CartService) { } 

  ngOnInit(): void {
  }



  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: 1
    };
    this.cartService.setCartItem(cartItem);
  }

}
