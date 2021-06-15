/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Cart, CartItem } from '../models/cart';

export const CART_KEY = "cart";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // new
  cart$ : BehaviorSubject<Cart> = new BehaviorSubject(this.getCard());

  constructor() { }
  // old
  initCartLocalStorage() {
    const cart: Cart = this.getCard();
    if(!cart){
      const initialCart = {
        items: []
      };
      const initialCartJson = JSON.stringify(initialCart);
      localStorage.setItem(CART_KEY, initialCartJson)
    }
    else{
      this.cart$.next(cart);
    }
  }

  emptyCart() {
    const initialCart = {
      items: []
    };
    const initialCartJson = JSON.stringify(initialCart);
    localStorage.setItem(CART_KEY, initialCartJson);
    this.cart$.next(initialCart);
  }

  //old - ko reload page
  // initCartLocalStorage() {
  //   const cart: Cart = this.getCard();
  //   if(cart){
  //     this.cart$.next(cart);
  //   }
  //   else{
  //     const initialCart = {
  //       items: []
  //     };
  //     const initialCartJson = JSON.stringify(initialCart);
  //     localStorage.setItem(CART_KEY, initialCartJson)
  //   }
  // }


  // ko reload
  // initCartLocalStorage() {
  //     const initialCart = {
  //       items: []
  //     };
  //     const initialCartJson = JSON.stringify(initialCart);
  //     localStorage.setItem(CART_KEY, initialCartJson)
  // }




  // old
  getCard(): Cart{
    const cartJsonString: any = localStorage.getItem(CART_KEY);
    const cart: Cart = JSON.parse(cartJsonString);
    return cart;
  }

  // old
  setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart{
    const cart = this.getCard();
    const cartItemExist = cart.items?.find((item) => item.productId === cartItem.productId)
    if(cartItemExist){
      cart.items?.map(item => {
        if(item.productId === cartItem.productId){
          if(updateCartItem){
            item.quantity = cartItem.quantity;  
          }
          else{
            item.quantity = item.quantity + cartItem.quantity;
          }
          return item;
        }
        else{return}
      })
    }
    else{
      cart.items?.push(cartItem);
    }
    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJson);
    // NEW
    this.cart$.next(cart);
    return cart;
  }


  deleteCartItem(productId: string){
    const cart = this.getCard();
    const newCart = cart.items?.filter(item=>item.productId !== productId)

    cart.items = newCart; 

    const cartJsonString = JSON.stringify(cart);
    localStorage.setItem(CART_KEY, cartJsonString);
    this.cart$.next(cart);
  }


}
